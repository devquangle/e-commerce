package com.dev.backend.dto.cart;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class DeleteCartItemsRequest {
    private List<Integer> cartItemIds;
}
