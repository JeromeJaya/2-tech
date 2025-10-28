export interface Decoration {
    id: string;
    name: string;
    price: number;
    imageSrc: string;
  }
  
  export const decorations: Decoration[] = [
    {
      id: 'deco-001',
      name: 'Pastel & White Balloon Arch',
      price: 2300,
      imageSrc: '/decorations/pastel-white-arch.jpg' // Make sure this path is correct
    },
    {
      id: 'deco-002',
      name: 'Boho Neutral Birthday Arch',
      price: 2800,
      imageSrc: '/decorations/boho-neutral-arch.jpg'
    },
    {
      id: 'deco-003',
      name: 'Classic Red & Black Arch',
      price: 3000,
      imageSrc: '/decorations/red-black-arch.jpg'
    },
    {
      id: 'deco-004',
      name: 'Pink & White Birthday Arch',
      price: 2500,
      imageSrc: '/decorations/pink-white-birthday-arch.jpg'
    },
    {
      id: 'deco-005',
      name: 'Elegant White & Gold Anniversary',
      price: 2800,
      imageSrc: '/decorations/white-gold-anniversary.jpg'
    },
    // ... Add all your other decorations here following the same structure
  ];