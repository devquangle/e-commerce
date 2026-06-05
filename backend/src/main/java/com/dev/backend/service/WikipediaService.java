package com.dev.backend.service;

import java.util.Set;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.dev.backend.dto.wikipedia.WikipediaApiResponse;
import com.dev.backend.dto.wikipedia.WikipediaResponse;
import com.dev.backend.exception.NotFoundException;
import com.dev.backend.util.Capitalize;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class WikipediaService {

    private final RestTemplate restTemplate;

    private static final Set<String> AUTHOR_QIDS = Set.of(
            "Q36180", // writer
            "Q4853732", // novelist
            "Q6625963", // poet
            "Q333634" // author
    );

    private static final String URL_VI = "https://vi.wikipedia.org/api/rest_v1/page/summary/";
    private static final String URL_EN = "https://en.wikipedia.org/api/rest_v1/page/summary/";
    private static final String USER_AGENT = "MyWikiApp/1.0 (email@gmail.com)";

    public WikipediaResponse fetchApiInforAuthor(String name) {
        if (name == null || name.trim().isEmpty()) {
            return null;
        }

        String text = Capitalize.capitalizeFully(name);
        String title = text.trim().replace(" ", "_");

        WikipediaResponse viResult = callWiki(URL_VI, title);
        if (viResult != null) {
            return viResult;
        }
        return callWiki(URL_EN, title);
    }

    private WikipediaResponse callWiki(String baseUrl, String title) {
        try {

            String url = baseUrl + title;

            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", USER_AGENT);
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<WikipediaApiResponse> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    WikipediaApiResponse.class);

            WikipediaApiResponse api = response.getBody();

            if (api == null) {
                return null;
            }

            WikipediaResponse res = new WikipediaResponse();
            res.setTitle(api.getTitle());
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
                boolean isValidAuthor = isAuthor(qid);
                if (!isValidAuthor) {
                    log.warn("Thực thể '{}' ({}) tìm thấy nhưng không thuộc nhóm tác giả hợp lệ.", title, qid);
                    throw new NotFoundException("Tìm thấy trên Wikipedia không phải là một tác giả hợp lệ.");

                }
            }

            return res;

        } catch (Exception e) {
               throw new NotFoundException("Lỗi khi fetch dữ liệu Wikipedia cho "
                    + title + " " +
                    e.getMessage());
        }
    }

    private boolean isAuthor(String qid) {
        try {
            String wikidataUrl = "https://www.wikidata.org/wiki/Special:EntityData/" + qid + ".json";

            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", USER_AGENT);
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    wikidataUrl,
                    HttpMethod.GET,
                    entity,
                    String.class);

            String json = response.getBody();
            if (json == null) {
                return false;
            }

            String upperCaseJson = json.toUpperCase();

            if (upperCaseJson.contains("\"P106\"")) {

                for (String authorQid : AUTHOR_QIDS) {
                    String upperAuthorQid = authorQid.toUpperCase();

                    if (upperCaseJson.contains("\"" + upperAuthorQid + "\"")) {
                        return true;
                    }
                }
            }

        } catch (Exception e) {
            throw new NotFoundException("Lỗi trong quá trình kiểm tra nghề nghiệp tại Wikidata cho mã QID "
                    + qid + " " +
                    e.getMessage());
        }
        return false;
    }
}