package com.hmsv1.repository;

import com.hmsv1.entity.RestockOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RestockOrderRepository extends JpaRepository<RestockOrder, Long> {
    List<RestockOrder> findByStatus(RestockOrder.Status status);
}
