package com.example.colorapi;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.UUID;

@Controller
public class ColorController {

    private final Random random = new Random();
    private final SaludoRepository saludoRepository;

    public ColorController(SaludoRepository saludoRepository) {
        this.saludoRepository = saludoRepository;
    }

    private String generarColor() {
        return String.format("#%06x", random.nextInt(0xFFFFFF + 1));
    }

    // GET / → página HTML
    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("color", generarColor());
        return "color";
    }

    // GET /color → JSON con color
    @GetMapping("/color")
    @ResponseBody
    public Map<String, String> getColor() {
        Map<String, String> response = new HashMap<>();
        response.put("color", generarColor());
        return response;
    }

    // POST /saludar → recibe JSON y devuelve JSON
    @PostMapping("/saludar")
    @ResponseBody
    public ResponseEntity<Map<String, String>> saludar(@RequestBody NombreRequest request) {
        String nombre = request.getNombre();

        if (nombre == null || nombre.trim().isEmpty()) {
            Map<String, String> error = new HashMap<>();
            error.put("detail", "El nombre no puede estar vacío");
            return ResponseEntity.badRequest().body(error);
        }

        String color = generarColor();

        Saludo saludo = new Saludo();
        saludo.setId(UUID.randomUUID().toString());
        saludo.setNombre(nombre.trim());
        saludo.setColor(color);
        saludo.setFecha(LocalDateTime.now());
        saludoRepository.save(saludo);

        Map<String, String> response = new HashMap<>();
        response.put("saludo", "¡Hola " + nombre.trim() + "!");
        response.put("color", color);
        return ResponseEntity.ok(response);
    }

    // GET /historial → JSON con todos los saludos guardados (más reciente primero)
    @GetMapping("/historial")
    @ResponseBody
    public List<Saludo> historial() {
        List<Saludo> saludos = saludoRepository.findAll();
        saludos.sort(Comparator.comparing(
                Saludo::getFecha,
                Comparator.nullsLast(Comparator.reverseOrder())));
        return saludos;
    }
}