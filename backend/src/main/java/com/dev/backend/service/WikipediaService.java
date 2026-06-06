package com.dev.backend.service;

import java.util.Set;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.dev.backend.dto.wikipedia.WikipediaApiResponse;
import com.dev.backend.dto.wikipedia.WikipediaResponse;
import com.dev.backend.exception.NotFoundException;
import com.dev.backend.util.TextUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class WikipediaService {

    private final RestTemplate restTemplate;
    
    private static final Set<String> AUTHOR_QIDS = Set.of(
        // --- VĂN HỌC & SÁNG TÁC ---
        "Q36180",   // writer (Nhà văn)
        "Q4853732", // novelist (Tiểu thuyết gia)
        "Q49757",   // poet (Thi sĩ / Nhà thơ)
        "Q6625963", // poet (Mã phụ)
        "Q333634",  // author (Tác giả nói chung)
        "Q214917",  // playwright (Nhà viết kịch)
        "Q11774201",// essayist (Nhà tiểu luận)

        // --- TRUYỆN TRANH & MINH HỌA ---
        "Q715301",  // manga artist (Họa sĩ manga Nhật)
        "Q2831",    // comic book creator (Người sáng tạo truyện tranh)
        "Q1930187", // graphic novelist (Tác giả tiểu thuyết đồ họa)
        "Q422960",  // illustrator (Họa sĩ minh họa)
        "Q17457788",// creative duo (Cặp đôi sáng tác - Cần thiết cho bộ đôi Fujiko Fujio)

        // --- DỊCH THUẬT & BIÊN SOẠN ---
        "Q1607826", // editor (Biên tập viên / Người biên soạn)

        // --- HỌC THUẬT & TRI THỨC ---
        "Q1622272", // university teacher / professor (Giáo sư / Giảng viên)
        "Q593644",  // intellectual (Học giả)
        "Q901",     // scientist (Nhà khoa học)
        "Q268305",  // historian (Nhà sử học)
        "Q496418"   // philosopher (Nhà triết học)
    );

    private static final String URL_VI = "https://vi.wikipedia.org/api/rest_v1/page/summary/";
    private static final String URL_EN = "https://en.wikipedia.org/api/rest_v1/page/summary/";
    private static final String USER_AGENT = "MyWikiApp/1.0 (email@gmail.com)";

    public WikipediaResponse fetchApiInforAuthor(String name) {
        if (name == null || name.trim().isEmpty()) {
            return null;
        }

      

        String text = TextUtils.capitalizeFully(name);
        String title = text.trim().replace(" ", "_");

        WikipediaResponse viResult = callWiki(URL_VI, title);
        if (viResult != null) {
            return viResult;
        }
        
        WikipediaResponse enResult = callWiki(URL_EN, title);
        if (enResult != null) {
            return enResult;
        }

        throw new NotFoundException("Không tìm thấy thông tin tác giả '" + name + "' trên cả Wikipedia tiếng Việt và tiếng Anh.");
    }

    private WikipediaResponse callWiki(String baseUrl, String title) {
        WikipediaApiResponse api;
        try {
            String url = baseUrl + title;
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", USER_AGENT);
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<WikipediaApiResponse> response = restTemplate.exchange(
                    url, HttpMethod.GET, entity, WikipediaApiResponse.class);

            api = response.getBody();
            if (api == null) return null;

        } catch (HttpClientErrorException.NotFound e) {
            return null; // Trả về null để vòng lặp ở ngoài chuyển sang quét URL_EN
        } catch (Exception e) {
            log.error("Lỗi kết nối API Wikipedia với tiêu đề {}: {}", title, e.getMessage());
            return null;
        }

        // Parse dữ liệu từ API sang DTO hệ thống
        WikipediaResponse res = new WikipediaResponse();
        res.setName(api.getTitle());
        res.setExtract(api.getExtract());
        res.setWikibaseItem(api.getWikibaseItem());

        if (api.getThumbnail() != null) {
            res.setUrlImage(api.getThumbnail().getSource());
        }
        if (api.getContentUrls() != null && api.getContentUrls().getDesktop() != null) {
            res.setUrlBio(api.getContentUrls().getDesktop().getPage());
        }

        // Validate kiểm tra vai trò tác giả
        String qid = res.getWikibaseItem();
        if (qid != null && !qid.isEmpty()) {
            // ĐÃ NÂNG CẤP: Truyền thêm Description và Extract để kiểm tra từ khóa dự phòng
            if (!isAuthor(qid, api.getDescription(), api.getExtract())) {
                log.warn("Thực thể '{}' ({}) không thuộc nhóm danh mục tác giả hợp lệ.", res.getName(), qid);
                throw new NotFoundException("Từ khóa tìm thấy trên Wikipedia không thuộc nhóm tác giả hợp lệ.");
            }
        }
        return res;
    }


    private boolean isAuthor(String qid, String description, String extract) {
        // 👉 BƯỚC 1: KIỂM TRA NHANH BẰNG TỪ KHÓA (Giải quyết triệt để các trang đổi hướng như Q3376801)
        String textToCheck = ((description != null ? description : "") + " " + (extract != null ? extract : "")).toLowerCase();
        
        if (textToCheck.contains("tác giả") || 
            textToCheck.contains("nhà văn") || 
            textToCheck.contains("tiểu thuyết") || 
            textToCheck.contains("manga") || 
            textToCheck.contains("họa sĩ") || 
            textToCheck.contains("truyện tranh") || 
            textToCheck.contains("dịch giả") ||
            textToCheck.contains("biên soạn") ||
            textToCheck.contains("author") ||
            textToCheck.contains("writer") ||
            textToCheck.contains("novelist")) {
            return true; // Khớp từ khóa cốt lõi -> Duyệt thẳng luôn
        }

        // 👉 BƯỚC 2: QUAY LẠI CHECK CẤU TRÚC JSON WIKIDATA (Nếu từ khóa mô tả quá ngắn hoặc mơ hồ)
        try {
            String wikidataUrl = "https://www.wikidata.org/wiki/Special:EntityData/" + qid + ".json";
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", USER_AGENT);
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    wikidataUrl, HttpMethod.GET, entity, String.class);

            String json = response.getBody();
            if (json == null) return false;

            String upperCaseJson = json.toUpperCase();

            // Chấp nhận cả thuộc tính nghề nghiệp (P106) hoặc Kiểu thực thể nhóm sáng tác (P31)
            if (upperCaseJson.contains("\"P106\"") || upperCaseJson.contains("\"P31\"")) {
                for (String authorQid : AUTHOR_QIDS) {
                    if (upperCaseJson.contains("\"" + authorQid.toUpperCase() + "\"")) {
                        return true;
                    }
                }
            }
        } catch (Exception e) {
            log.error("Lỗi khi kết nối kiểm tra dữ liệu tại Wikidata cho mã QID {}: {}", qid, e.getMessage());
            return false;
        }
        return false;
    }
}