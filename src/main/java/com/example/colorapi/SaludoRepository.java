package com.example.colorapi;

import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;

import java.util.ArrayList;
import java.util.List;

@Repository
public class SaludoRepository {

    private final DynamoDbTable<Saludo> table;

    public SaludoRepository(DynamoDbTable<Saludo> table) {
        this.table = table;
    }

    public void save(Saludo saludo) {
        table.putItem(saludo);
    }

    public List<Saludo> findAll() {
        List<Saludo> saludos = new ArrayList<>();

        table.scan()
                .items()
                .forEach(saludos::add);

        return saludos;
    }
}