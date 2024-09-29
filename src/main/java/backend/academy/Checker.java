package backend.academy;

public class Checker {
    public boolean check(float x, byte y, float r) {
        if (r <= 0) {
            return false;
        }
        if (y==0 && x==0){
            return true;
        }

        // Проверка для x < 0
        if (x < 0) {
            // 2-й квадрант (x < 0 и y > 0) - четверть круга радиуса r
            if (y > 0) {
                return x * x + y * y <= r * r;
            }
            else if (y < 0)  {
                return -x <= r / 2.0f && -y <= r;
            }else {
                return x * x <= r * r || -x <= r / 2.0f;
            }
        }
        else {
            // 1-й квадрант (x >= 0 и y > 0) - точка не входит в область
            if (y > 0) {
                return false;
            }
            // 4-й квадрант (x >= 0 и y < 0) - треугольник с гипотенузой на линии y = x/2 - r/2
            else  {
                return y >= x / 2.0f - r / 2.0f && x<=r;
            }
        }

        // Если точка находится на осях или не попадает в область
    }
}
