package com.dev.backend.service;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.dev.backend.dto.wikipedia.WikipediaApiResponse;
import com.dev.backend.dto.wikipedia.WikipediaResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WikipediaService {

    private final RestTemplate restTemplate;

    private static final String URL_VI = "https://vi.wikipedia.org/api/rest_v1/page/summary/";

    private static final String URL_EN = "https://en.wikipedia.org/api/rest_v1/page/summary/";

    public WikipediaResponse fetchApiInforAuthor(String name) {

        String title = name.trim().replace(" ", "_");

        // 👉 1. TRY VI FIRST
        WikipediaResponse viResult = callWiki(URL_VI, title);
        if (viResult != null) {
            return viResult;
        }

        // 👉 2. FALLBACK EN
        return callWiki(URL_EN, title);
    }

    private WikipediaResponse callWiki(String baseUrl, String title) {

        try {
            String url = baseUrl + title;

            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "MyWikiApp/1.0 (email@gmail.com)");

            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<WikipediaApiResponse> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    WikipediaApiResponse.class);

            WikipediaApiResponse api = response.getBody();

            if (api == null)
                return null;

            WikipediaResponse res = new WikipediaResponse();

            res.setTitle(api.getTitle());
            res.setExtract(api.getExtract());
            res.setWikibaseItem(api.getWikibaseItem());

            if (api.getThumbnail() != null) {
                res.setUrlImage(api.getThumbnail().getSource());
            }

            if (api.getContentUrls() != null &&
                    api.getContentUrls().getDesktop() != null) {

                res.setUrlBio(
                        api.getContentUrls()
                                .getDesktop()
                                .getPage());
            }

            return res;

        } catch (Exception e) {
            return null;
        }
    }
}