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
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class WikipediaService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    private static final Set<String> BOOK_AUTHOR_QIDS = Set.of(
            "Q36180", "Q4853732", "Q49757", "Q6625963", "Q333634", "Q214917", "Q11774201",
            "Q715301", "Q2831", "Q1930187", "Q422960", "Q17457788",
            "Q1334054", "Q1607826",
            "Q1622272", "Q593644", "Q901", "Q268305", "Q496418"
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

        throw new NotFoundException(
                "Không tìm thấy thông tin tác giả '" + name + "' trên cả Wikipedia tiếng Việt và tiếng Anh.");
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
            if (api == null)
                return null;

        } catch (HttpClientErrorException.NotFound e) {
            return null; 
        } catch (Exception e) {
            log.error("Lỗi kết nối API Wikipedia với tiêu đề {}: {}", title, e.getMessage());
            return null;
        }

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

        String qid = res.getWikibaseItem();
        if (qid != null && !qid.isEmpty()) {
            if (!isAuthor(qid, api.getDescription(), api.getExtract())) {
                log.warn("Thực thể '{}' ({}) không thuộc nhóm danh mục tác giả hợp lệ.", res.getName(), qid);
                throw new NotFoundException("Từ khóa tìm thấy trên Wikipedia không thuộc nhóm tác giả hợp lệ.");
            }
        }
        return res;
    }

    private boolean isAuthor(String qid, String description, String extract) {
        // 👉 BƯỚC 1: KIỂM TRA NHANH BẰNG TỪ KHÓA
        String textToCheck = ((description != null ? description : "") + " " + (extract != null ? extract : ""))
                .toLowerCase();

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
            return true;
        }

        try {
            String wikidataUrl = "https://www.wikidata.org/wiki/Special:EntityData/" + qid + ".json";
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", USER_AGENT);
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    wikidataUrl, HttpMethod.GET, entity, String.class);

            String json = response.getBody();
            if (json == null) return false;

            // 👉 BƯỚC 2: PARSE JSON BẰNG JACKSON ĐỂ DUYỆT CHÍNH XÁC CLAIMS (P106 / P31)
            JsonNode rootNode = objectMapper.readTree(json);
            
            // Cấu trúc Wikidata trả về dạng: entities -> {qid} -> claims
            JsonNode claimsNode = rootNode.path("entities").path(qid).path("claims");

            if (claimsNode.isMissingNode()) {
                return false;
            }

            // Kiểm tra trên cả 2 thuộc tính: P106 (nghề nghiệp) và P31 (là thể loại gì)
            String[] targetProperties = {"P106", "P31"};
            
            for (String property : targetProperties) {
                JsonNode propNode = claimsNode.path(property);
                if (propNode.isArray()) {
                    for (JsonNode statement : propNode) {
                        // Đi theo đường dẫn chuẩn của Wikidata claim value
                        JsonNode idNode = statement.path("mainsnak")
                                                   .path("datavalue")
                                                   .path("value")
                                                   .path("id");

                        if (idNode.isTextual()) {
                            String foundQid = idNode.asText();
                            if (BOOK_AUTHOR_QIDS.contains(foundQid)) {
                                return true; // Khớp chính xác QID trong khối định nghĩa nghiệp vụ/thực thể
                            }
                        }
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