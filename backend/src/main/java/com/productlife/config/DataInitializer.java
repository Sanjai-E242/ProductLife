package com.productlife.config;

import com.productlife.entity.Product;
import com.productlife.entity.RepairHistory;
import com.productlife.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.List;

/**
 * DataInitializer Component
 * 
 * Automatically populates sample demonstration products and repair logs
 * into MySQL upon initial startup if the database is empty.
 */
@Configuration
public class DataInitializer {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Bean
    public CommandLineRunner initDatabase(ProductRepository productRepository) {
        return args -> {
            if (productRepository.count() == 0) {
                log.info("Seeding initial demonstration products and repair history into MySQL...");

                // 1. EcoSmart Thermal Flask
                Product p1 = new Product(
                    "PL-ECO-001",
                    "HydroPure Thermal Flask 750ml",
                    "EcoHydrate Tech",
                    "Drinkware",
                    "HP-750-SLV",
                    "Nordic EcoWorks AB",
                    "Sweden",
                    "Double-walled vacuum insulated flask manufactured with 92% recycled stainless steel and food-grade silicone seals.",
                    "92% Recycled 304 Stainless Steel, 8% Medical Grade Silicone",
                    LocalDate.of(2024, 3, 15),
                    "Hand wash with warm soapy water. Do not microwave. Replace silicone gasket every 3 years for optimal seal.",
                    "Separate silicone gasket from steel body. Both components are 100% recyclable at standard municipal collection points.",
                    "/images/flask.png"
                );

                RepairHistory r1 = new RepairHistory(
                    LocalDate.of(2024, 8, 10),
                    "Stockholm Eco Repair Hub",
                    "Replaced worn silicone lid gasket and inspected vacuum thermal seal.",
                    "Silicone O-Ring Gasket (Model GK-750)",
                    "Thermal pressure retention tested and verified optimal (keeps hot 18h)."
                );
                p1.addRepairRecord(r1);

                // 2. Circular Running Sneaker
                Product p2 = new Product(
                    "PL-TEX-002",
                    "PureStride Circular Running Sneaker",
                    "CircuWear Athletics",
                    "Footwear",
                    "PS-RUN-V2",
                    "Lusitania Sustainable Mills",
                    "Portugal",
                    "Mono-material performance running shoe designed for 100% mechanical recycling without toxic chemical adhesive.",
                    "100% Recycled Thermoplastic Polyurethane (TPU) & Ocean-Bound Plastics",
                    LocalDate.of(2024, 6, 20),
                    "Wipe with damp cloth and mild eco-detergent. Air dry in shade. Removable insoles are machine washable.",
                    "Return to any CircuWear drop-off bin or certified mono-plastic textile shredding partner for raw TPU pellet re-granulation.",
                    "/images/sneaker.png"
                );

                // 3. Modular Wireless Headphones
                Product p3 = new Product(
                    "PL-ELE-003",
                    "Modular Sound Wireless Headphones",
                    "Aura Acoustics",
                    "Electronics",
                    "MOD-ANC-X",
                    "Bavaria Precision Audio GmbH",
                    "Germany",
                    "Modular high-fidelity wireless headphones with swappable lithium battery cells and screw-less magnetic ear cushions.",
                    "Recycled Aluminum, FSC-Certified Birchwood, Bioplastic Enclosure",
                    LocalDate.of(2024, 1, 10),
                    "Store in protective case when traveling. Clean drivers with dry microfiber cloth. Avoid exposure to liquids.",
                    "Remove magnetic ear pads and unscrew battery module using standard Torx T5 tool before recycling e-waste components.",
                    "/images/headphones.png"
                );

                RepairHistory r3_1 = new RepairHistory(
                    LocalDate.of(2024, 5, 12),
                    "Berlin Audio Care Center",
                    "Replaced left headband magnetic hinge cushion.",
                    "Left Magnetic Cushion Assembly (Part HNG-L4)",
                    "Acoustic calibration re-verified. Sound balance equalized."
                );
                RepairHistory r3_2 = new RepairHistory(
                    LocalDate.of(2024, 11, 2),
                    "Munich Tech Repair Lab",
                    "Preventative battery cell swap following 500 charge cycles.",
                    "Lithium-Polymer Cell 650mAh (Part BAT-MOD-X)",
                    "Battery health restored to 100% capacity."
                );
                p3.addRepairRecord(r3_1);
                p3.addRepairRecord(r3_2);

                // 4. Solar Adventure Backpack
                Product p4 = new Product(
                    "PL-OUT-004",
                    "TerraShield Solar Exploration Backpack",
                    "Vanguard Outdoors",
                    "Gear",
                    "TS-EXP-35L",
                    "Mekong Delta EcoTextiles Ltd",
                    "Vietnam",
                    "Waterproof all-weather adventure pack integrated with lightweight flexible monocrystalline solar cell charging panel.",
                    "Recycled CORDURA Nylon, YKK Natulon Zippers, Flexible ETFE Solar Cell",
                    LocalDate.of(2024, 8, 5),
                    "Detach solar regulator before spot cleaning fabric with lukewarm water. Do not machine wash or tumble dry.",
                    "Unzip inner liner to unclip solar module for dedicated photovoltaic recycling. Fabric enters nylon reclamation streams.",
                    "/images/backpack.png"
                );

                productRepository.saveAll(List.of(p1, p2, p3, p4));
                log.info("Successfully seeded 4 demonstration products with repair records into MySQL!");
            } else {
                log.info("Database already contains {} products. Skipping seeding.", productRepository.count());
                List<Product> existing = productRepository.findAll();
                boolean updatedAny = false;
                for (Product p : existing) {
                    if (p.getStatus() == null || p.getStatus().trim().isEmpty()) {
                        p.setStatus("ACTIVE");
                        updatedAny = true;
                    }
                }
                if (updatedAny) {
                    productRepository.saveAll(existing);
                    log.info("Initialized status to ACTIVE for existing products.");
                }
            }
        };
    }
}
