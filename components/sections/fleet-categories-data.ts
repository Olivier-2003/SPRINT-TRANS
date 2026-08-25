// Prawdziwe kategorie pojazdów SPRINT-TRANS — współdzielone między FleetCategories
// (/flota) i FleetPreview (strona główna), żeby dane nie rozjeżdżały się w dwóch miejscach.
export const FLEET_CATEGORIES = [
  {
    photo: "/flota/pojemne-autobusy.jpg",
    badge: "50-68 miejsc",
    title: "Pojemne autobusy",
    description:
      "Nasze pojemne autokary to doskonały wybór do obsługi większych i dużych grup — od szkolnych wycieczek po firmowe wyjazdy integracyjne. Przestronne wnętrze gwarantuje wygodę nawet na najdłuższych trasach. Pojazdy zostały wyposażone w niezwykle obszerne luki podpokładowe, które bez trudu pomieszczą duże walizki i bagaże dla całych grup. Takie rozwiązanie pozwala utrzymać porządek wewnątrz autokaru i znacząco podnosi komfort samej podróży.",
  },
  {
    photo: "/flota/komfortowe-busy.jpg",
    badge: "20-23 miejsca",
    title: "Komfortowe busy",
    description:
      "To optymalne rozwiązanie dla mniejszych zleceń, które świetnie sprawdza się w przewozach pracowniczych, transferach lotniskowych czy podczas wyjazdów integracyjnych. Zadbaliśmy o to, aby każda podróż była płynna i dobrze zorganizowana. Nasze busy zostały zaprojektowane z myślą o efektywności — oferują dedykowaną przestrzeń na bagaż główny oraz wygodne schowki na drobniejsze przedmioty, zapewniając pasażerom maksymalną wygodę.",
  },
  {
    photo: "/flota/mercedes-v-class.jpg",
    badge: "6 miejsc",
    title: "Mercedes V-Class",
    description:
      "Nasza absolutna wizytówka w segmencie premium, gwarantująca najwyższy standard podróży. To pojazd idealnie łączący luksus z funkcjonalnością, dedykowany dla najbardziej wymagających klientów, delegacji VIP oraz na wyjątkowe, specjalne okazje. Przemyślane wnętrze sprawia, że nawet przy pełnej obsadzie pasażerskiej auto oferuje bardzo elastyczną przestrzeń bagażową, pozwalając na w pełni komfortową i prestiżową jazdę.",
  },
] as const;
