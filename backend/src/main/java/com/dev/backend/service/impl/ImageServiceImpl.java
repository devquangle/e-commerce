package com.dev.backend.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dev.backend.dto.image.ImageResponse;
import com.dev.backend.dto.image.ProductImageResponse;
import com.dev.backend.entity.Image;
import com.dev.backend.entity.Product;
import com.dev.backend.mapper.ImageMapper;
import com.dev.backend.repository.ImageRepository;
import com.dev.backend.service.ImageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ImageServiceImpl implements ImageService {
    private final ImageRepository imageRepository;
    private final ImageMapper imageMapper;

    @Override
    public void delete(Integer id) {
        // TODO Auto-generated method stub

    }

    @Override
    public Image save(Image image) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    @Transactional // Đảm bảo tính toàn vẹn: Hoặc thành công hết, hoặc rollback hết nếu lỗi
    public void saveProductImages(Product product, List<ImageResponse> imageResponses) {
        // 1. Lấy tất cả ảnh hiện tại đang lưu dưới DB của Product này
        List<Image> existingImages = imageRepository.findImagesByProductId(product.getId());

        // Nếu danh sách mới trống -> Người dùng đã xóa sạch ảnh của sản phẩm này trên
        // UI
        if (imageResponses == null || imageResponses.isEmpty()) {
            if (!existingImages.isEmpty()) {
                imageRepository.deleteAll(existingImages);
            }
            return;
        }

        // 2. Gom tất cả URL mới từ ImageResponse gửi lên thành một danh sách để đối
        // chiếu
        List<String> newUrls = imageResponses.stream()
                .map(item -> item.url()) // Gọi đúng method url() từ Record của bạn
                .filter(url -> url != null && !url.isBlank())
                .toList();

        // 📌 HÀNH ĐỘNG 1: TÌM ẢNH CẦN XÓA
        // Ảnh nào đang có dưới DB nhưng KHÔNG nằm trong danh sách mới gửi lên -> Bị xóa
        List<Image> toDelete = existingImages.stream()
                .filter(img -> !newUrls.contains(img.getUrlImage()))
                .toList();

        // 3. Phân loại để THÊM MỚI hoặc CẬP NHẬT trạng thái Thumbnail
        List<Image> toSave = new ArrayList<>();

        for (ImageResponse item : imageResponses) {
            if (item.url() == null || item.url().isBlank()) {
                continue; // Bỏ qua nếu dữ liệu lỗi không có URL
            }

            // Tìm xem URL từ Cloudinary này đã tồn tại dưới DB của Product này chưa
            Optional<Image> existingImageOpt = existingImages.stream()
                    .filter(img -> img.getUrlImage().equals(item.url()))
                    .findFirst();

            if (existingImageOpt.isPresent()) {
                // 📌 HÀNH ĐỘNG 2: CẬP NHẬT TRẠNG THÁI THUMBNAIL
                // Ảnh cũ vẫn giữ lại, nhưng check xem người dùng có thay đổi nút tích chọn ảnh
                // đại diện hay không
                Image existingImage = existingImageOpt.get();
                if (existingImage.isThumbnail() != item.isThumbnail()) { // Gọi đúng item.isThumbnail() từ Record của
                                                                         // bạn
                    existingImage.setThumbnail(item.isThumbnail());
                    toSave.add(existingImage); // Thêm vào danh sách để UPDATE
                }
            } else {
                // 📌 HÀNH ĐỘNG 3: THÊM MỚI BẢN GHI
                // URL này hoàn toàn mới (Do Frontend vừa up lên Cloudinary thành công rồi
                // truyền vào đây)
                Image newImage = new Image();
                newImage.setUrlImage(item.url());
                newImage.setThumbnail(item.isThumbnail());
                newImage.setProduct(product);
                toSave.add(newImage); // Thêm vào danh sách để INSERT
            }
        }

        // 4. Đồng bộ tất cả thay đổi xuống Database
        if (!toDelete.isEmpty()) {
            imageRepository.deleteAll(toDelete); // Bắn lệnh DELETE
        }

        if (!toSave.isEmpty()) {
            imageRepository.saveAll(toSave); // Tự động INSERT bản ghi mới và UPDATE bản ghi cũ có sự thay đổi
        }
    }

    @Override
    public List<ProductImageResponse> findImagesByProductId(Integer productId) {
        List<Image> images = imageRepository.findImagesByProductId(productId);

        return images.stream()
                .map(imageMapper::toProductImages)
                .toList();
    }

    @Override
    public String getUrlImageIsThumbnailByProductId(Integer productId) {
        String thumbnail = imageRepository.findUrlImageIsThumbnailByProductId(productId).orElse(null);
        return thumbnail;
    }
}
