package backend.academy;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

public class Params {
    public float getX() {
        return x;
    }

    public byte getY() {
        return y;
    }

    public float getR() {
        return r;
    }

    private final float x;
    private final byte y;
    private final float r;
    public Params(String queryParams) {
        Map<String, String> params=parseQueryParams(queryParams);
        try {
            x = Float.parseFloat(params.get("x"));
            y=Byte.parseByte(params.get("y"));
            r=Float.parseFloat(params.get("R"));
        }catch (NumberFormatException e){
            throw new ValidationException("String invalid");
        }


    }
    private Map<String, String> parseQueryParams(String queryParams) {
        Map<String, String> paramsMap = new HashMap<>();
        if (queryParams == null || queryParams.isEmpty()) {
            return paramsMap; // Пустые параметры
        }

        String[] pairs = queryParams.split("&");
        for (String pair : pairs) {
            String[] keyValue = pair.split("=");
            if (keyValue.length == 2) {
                paramsMap.put(keyValue[0], keyValue[1]); // Ключ=Значение
            }
        }

        return paramsMap;
    }

}
