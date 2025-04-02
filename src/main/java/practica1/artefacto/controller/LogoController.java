package practica1.artefacto.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/logos")
public class LogoController {

    private static final Map<String, String> knownTeamsLogos = new HashMap<>();
    
    static {
        knownTeamsLogos.put("atleticodemadrid", "/logos/atleticodemadrid.JPG");
        knownTeamsLogos.put("barcelona", "/logos/barcelona.JPG");
        knownTeamsLogos.put("bayern", "/logos/bayern.JPEG");
        knownTeamsLogos.put("betis", "/logos/betis.JPG");
        knownTeamsLogos.put("borusia", "/logos/borusia.JPG");
        knownTeamsLogos.put("liverpool", "/logos/liverpool.JPG");
        knownTeamsLogos.put("milan", "/logos/milan.JPG");
        knownTeamsLogos.put("monaco", "/logos/monaco.JPG");
        knownTeamsLogos.put("psg", "/logos/psg.JPG");
        knownTeamsLogos.put("realmadrid", "/logos/realmadrid.JPG");
    }

    @GetMapping("/{name}")
    public ResponseEntity<String> getLogoUrl(@PathVariable String name) {
        String logoPath = knownTeamsLogos.get(name.toLowerCase());
        
        if (logoPath == null) {
            logoPath = "/logos/default.png";
        }
        
        return ResponseEntity.ok(logoPath);
    }
}