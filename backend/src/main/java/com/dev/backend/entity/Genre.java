package com.dev.backend.entity;

import java.util.List;

import com.dev.backend.constant.GenreStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Builder
@Table(name = "genres")
public class Genre extends BaseEntity<Integer>  {


    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private GenreStatus status = GenreStatus.ACTIVE;

    @OneToMany(mappedBy = "genre")
    private List<ProductGenre> productGenres;
}
