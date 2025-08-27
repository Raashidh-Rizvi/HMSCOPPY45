package com.hmsv1.controller;

import com.hmsv1.entity.RestockOrder;
import com.hmsv1.service.RestockOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/restock-orders")
public class RestockOrderController {

    @Autowired
    private RestockOrderService restockOrderService;

    @GetMapping
    public List<RestockOrder> getAllOrders() {
        return restockOrderService.getAllOrders();
    }

    @GetMapping("/{id}")
    public ResponseEntity<RestockOrder> getOrderById(@PathVariable Long id) {
        Optional<RestockOrder> order = restockOrderService.getOrderById(id);
        return order.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    public List<RestockOrder> getOrdersByStatus(@PathVariable RestockOrder.Status status) {
        return restockOrderService.getOrdersByStatus(status);
    }

    @PostMapping
    public RestockOrder createOrder(@RequestBody RestockOrder order) {
        return restockOrderService.saveOrder(order);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RestockOrder> updateOrder(@PathVariable Long id, @RequestBody RestockOrder updatedOrder) {
        return restockOrderService.getOrderById(id).map(order -> {
            updatedOrder.setId(id);
            RestockOrder savedOrder = restockOrderService.saveOrder(updatedOrder);
            return ResponseEntity.ok(savedOrder);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        restockOrderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }
}
