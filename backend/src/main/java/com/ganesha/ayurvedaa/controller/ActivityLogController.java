package com.ganesha.ayurvedaa.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;

@RestController
@RequestMapping("/api/activity-logs")
@RequiredArgsConstructor
public class ActivityLogController {

    private static final CopyOnWriteArrayList<Map<String, Object>> store = new CopyOnWriteArrayList<>();
    private static final AtomicLong counter = new AtomicLong(1);

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        int from = page * size;
        int to = Math.min(from + size, store.size());
        var content = from > store.size() ? java.util.List.of() : store.subList(from, to);
        return ResponseEntity.ok(Map.of(
                "content", content,
                "totalElements", store.size(),
                "totalPages", (int) Math.ceil((double) store.size() / size),
                "number", page,
                "size", size
        ));
    }

    public static void log(String userName, String action, String entity, Long entityId, String details) {
        store.add(0, Map.of(
                "id", counter.getAndIncrement(),
                "userName", userName != null ? userName : "System",
                "action", action,
                "entity", entity,
                "entityId", entityId != null ? entityId : 0L,
                "details", details != null ? details : "",
                "createdAt", LocalDateTime.now().toString()
        ));
        if (store.size() > 500) store.remove(store.size() - 1);
    }
}
