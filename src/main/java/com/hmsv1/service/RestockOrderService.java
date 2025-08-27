package com.hmsv1.service;

import com.hmsv1.entity.RestockOrder;
import com.hmsv1.repository.RestockOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RestockOrderService {

    @Autowired
    private RestockOrderRepository restockOrderRepository;

    public List<RestockOrder> getAllOrders() {
        return restockOrderRepository.findAll();
    }

    public Optional<RestockOrder> getOrderById(Long id) {
        return restockOrderRepository.findById(id);
    }

    public List<RestockOrder> getOrdersByStatus(RestockOrder.Status status) {
        return restockOrderRepository.findByStatus(status);
    }

    public RestockOrder saveOrder(RestockOrder order) {
        return restockOrderRepository.save(order);
    }

    public void deleteOrder(Long id) {
        restockOrderRepository.deleteById(id);
    }
}
