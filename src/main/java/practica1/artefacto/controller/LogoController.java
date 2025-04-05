package practica1.artefacto.controller;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/logos")
public class LogoController {

    @GetMapping("/{name}")
    public ResponseEntity<Resource> getLogo(@PathVariable String name) {
        String logoPath = "static/logos/" + name.toLowerCase() + ".JPG";
        // Check if the logo file exists in the classpath if not just return 404
        

        Resource resource = new ClassPathResource(logoPath);
        if (!resource.exists()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, "image/jpeg") // Adjust content type based on your image format
                .body(resource);
    }
}