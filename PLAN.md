### TCG Mağaza Bulucu - Frontend Uygulama Planı

Bu plan, `Türkiyede Orijinal TCG Satan Yerler - Sheet1.csv` dosyasındaki verileri, kullanıcıların şehir ve mağaza türü (fiziksel/online) gibi kriterlere göre kolayca filtreleyebileceği, hızlı ve modern bir web uygulamasına dönüştürmeyi amaçlamaktadır.

**Kullanılacak Teknolojiler:**
*   **Çerçeve (Framework):** React (Vite ile kurulacak)
*   **Stil (Styling):** Tailwind CSS
*   **Veri Formatı:** CSV dosyası, uygulama içinde kolayca kullanılabilmesi için JSON formatına dönüştürülecektir.

---

### Geliştirme Adımları

**1. Adım: Proje Kurulumu ve Yapılandırma**
*   **Vite ile React Projesi Oluşturma:** `npm create vite@latest tcg-scope-frontend -- --template react-ts` komutu ile hızlı ve modern bir React projesi başlatılacak. (Proje adı küçük harfli olmalı.)
*   **Tailwind CSS Entegrasyonu:** Projeye Tailwind CSS ve gerekli bağımlılıkları (`postcss`, `autoprefixer`) eklenecek. `tailwind.config.js` dosyası yapılandırılarak projenin stil altyapısı hazırlanacak.

**2. Adım: Veri Hazırlığı**
*   **CSV'den JSON'a Dönüşüm:** Uygulamanın veriyi doğrudan işleyebilmesi için sağladığınız CSV dosyası, tek seferlik bir işlemle bir JSON dizisine (`stores.json`) dönüştürülecek. Bu dosya, projenin `src` klasörüne yerleştirilecek ve uygulama tarafından doğrudan import edilecek. Bu sayede harici bir kütüphaneye veya karmaşık dosya okuma işlemlerine gerek kalmayacak.

**3. Adım: Arayüz (UI) Bileşenlerinin Geliştirilmesi**
Uygulama, yeniden kullanılabilir ve modüler bileşenlerden oluşacak:
*   **`FilterBar` (Filtreleme Çubuğu):**
    *   Kullanıcıların mağazaları **şehire** göre seçebileceği bir dropdown (açılır menü).
    *   Mağazaları **türüne** göre (örneğin "Fiziksel Mağaza", "Online Mağaza") filtrelemek için butonlar veya checkbox'lar.
    *   Mobil görünümde bu filtreler ekranın üst kısmında veya açılabilir bir menüde yer alacak.
*   **`StoreList` (Mağaza Listesi):**
    *   Filtrelenmiş sonuçları gösterecek olan ana bölüm.
    *   Her bir mağaza, `StoreCard` bileşeni kullanılarak listelenecek.
*   **`StoreCard` (Mağaza Kartı):**
    *   Tek bir mağazanın bilgilerini (Mağaza Adı, Şehir, Adres, Web Sitesi vb.) temiz ve okunaklı bir şekilde gösterecek olan kart tasarımı.
    *   Mağazanın web sitesi varsa, tıklanabilir bir link içerecek.

**4. Adım: Filtreleme Mantığı ve Durum Yönetimi (State Management)**
*   React'in `useState` hook'u kullanılarak kullanıcı tarafından seçilen filtreler (örneğin seçili şehir) ve orijinal mağaza listesi bir state içinde tutulacak.
*   Filtrelerde bir değişiklik olduğunda, ana mağaza listesi üzerinde filtreleme işlemi yapılarak sadece koşullara uyan mağazaların `StoreList` bileşeninde gösterilmesi sağlanacak.

**5. Adım: Stil ve Duyarlılık (Styling & Responsiveness)**
*   Tüm bileşenler, Tailwind CSS'in utility sınıfları kullanılarak modern ve sade bir görünüme kavuşturulacak.
*   Tailwind'in **responsive tasarım** özellikleri (`md:`, `lg:` gibi prefix'ler) kullanılarak uygulamanın tüm ekran boyutlarında (mobil, tablet, masaüstü) sorunsuz ve kullanıcı dostu bir deneyim sunması sağlanacak. Örneğin, masaüstünde filtreler kenarda bir sütun olarak dururken, mobilde ekranın üst kısmına yerleştirilebilir.
