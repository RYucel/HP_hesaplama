# CPI Hesaplayıcı 🧮

Tüketici Fiyat Endeksi (TÜFE) değişimini hesaplamak için geliştirilmiş web tabanlı araç.  
[![GitHub License](https://img.shields.io/github/license/kullaniciadiniz/cpi-hesaplayici)](LICENSE)
[![Vercel Deployment](https://img.shields.io/badge/Canlı%20Demo-Vercel-brightgreen)](https://cpi-hesaplayici.vercel.app)

<img src="https://i.imgur.com/3sGJZ3g.png" alt="Demo Görseli" width="600">

## 📋 İçindekiler
- [Özellikler](#özellikler-)
- [Kurulum](#kurulum-)
- [Kullanım Kılavuzu](#kullanım-kılavuzu-)
- [Veri Formatı](#veri-formatı-)
- [Teknik Detaylar](#teknik-detaylar-)
- [Katkı](#katkıda-bulunma-)
- [Lisans](#lisans-)

## Özellikler ✨
- 📊 5 ürün için paralel hesaplama
- 🔍 Lunr.js ile akıllı ürün arama
- 📈 Gerçek zamanlı CPI değişim analizi
- 📱 Mobil uyumlu responsive tasarım
- 📥 CSV tabanlı veri yönetimi
- 🗂️ Ağırlığa göre sıralanabilir ürün listesi

## Kurulum 🔧

### Yerel Kurulum
```bash
# Repoyu klonla
git clone https://github.com/kullaniciadiniz/cpi-hesaplayici.git

# Proje dizinine gir
cd cpi-hesaplayici

# Basit HTTP sunucusu başlat (Python 3.x)
python -m http.server 8000

# Tarayıcıda aç
# http://localhost:8000
```

### Online Dağıtım
1. [Vercel](https://vercel.com) ile otomatik deploy:
   - GitHub repo bağlantısı yap
   - Build komutu **gerekmez**
   - `main` branch'ini seç

2. GitHub Pages:
   - Repo Settings → Pages → "main" branch ve "/root" seç

## Kullanım Kılavuzu 📖

### Temel İşlemler
1. **Ürün Ekleme**  
   - Arama kutusuna ürün adı yaz (Ör: "Ekmek")
   - Açılan listeden ürünü seç

2. **Değişim Tipi Seçimi**  
   ```markdown
   - Yüzde Değişimi (%): Ürün fiyatındaki yüzdelik artış/azalış
   - Yeni Fiyat: Direkt fiyat girişi
   ```

3. **Hesaplama**  
   - Tüm alanları doldurduktan sonra  
   - "CPI Değişimini Hesapla" butonuna tıkla

### Gelişmiş Özellikler
- **🗑️ Temizle**: Tüm girdileri sıfırla
- **📋 Tüm Ürünler**: Ağırlıklı ürün listesini görüntüle
- **📌 Bireysel Katkılar**: Her ürünün CPI'ye etkisini incele

## Veri Formatı 📂
`data.csv` örnek yapısı:
```csv
product,weight,LastMonthPrice
Ekmek,1.45,80.00
Süt,0.95,25.50
Yumurta,0.75,45.00
Peynir,0.60,120.00
Benzin,2.10,35.75
```

## Teknik Detaylar ⚙️
| Bileşen          | Teknoloji      |
|-------------------|----------------|
| Frontend Framework| Vanilla JS     |
| Arama Motoru      | Lunr.js        |
| Styling           | Pure CSS       |
| Veri Yönetimi     | CSV            |
| Hosting           | Vercel         |

## Katkıda Bulunma 🤝
1. Repoyu fork'layın
2. Yeni branch oluşturun:
   ```bash
   git checkout -b yeni-ozellik
   ```
3. Değişikliklerinizi yapın ve commit'leyin
4. Branch'inizi push'layın:
   ```bash
   git push origin yeni-ozellik
   ```
5. Pull Request açın

## Lisans 📄
Bu proje MIT Lisansı ile lisanslanmıştır - detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

**🌍 Canlı Demo:** [Vercel Deployment](https://cpi-hesaplayici.vercel.app)  
**🐛 Hata Bildirimi:** [Issues Section](https://github.com/kullaniciadiniz/cpi-hesaplayici/issues)

