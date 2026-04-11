package com.dev.backend.service;

import java.io.IOException;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
@Service
public class CloudinaryService {
    private static String CLOUD_NAME = "dox0mkwaz";
    private static String API_KEY = "652873321396173";
    private static String API_SECRET = "rEZl-yCzLpfaNtmUsvG_xcOIbGA";

    private static Cloudinary cloudinary = new Cloudinary(ObjectUtils.asMap(
            "cloud_name", CLOUD_NAME, // Thay thế bằng cloud name của bạn
            "api_key", API_KEY, // Thay thế bằng API key của bạn
            "api_secret", API_SECRET // Thay thế bằng API secret của bạn
    ));

    public static String uploadImage(MultipartFile file) throws IOException {
        return (String) cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap()).get("secure_url");
    }
}
