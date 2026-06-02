package com.dev.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dev.backend.entity.Product;
@Repository
public interface ProductRepository extends JpaRepository<Product, Integer>{
    
}
