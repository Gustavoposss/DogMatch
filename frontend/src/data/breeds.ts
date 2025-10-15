export const DOG_BREEDS = [
  'Sem Raça Definida',
  'Shih Tzu',
  'Yorkshire Terrier',
  'Spitz Alemão',
  'Lhasa Apso',
  'Golden Retriever',
  'Pinscher',
  'Dachshund',
  'Pug',
  'Maltês',
  'Poodle',
  'Labrador Retriever',
  'Pastor Alemão',
  'Bulldog Francês',
  'Beagle',
  'Rottweiler',
  'Chihuahua',
  'Husky Siberiano',
  'Border Collie',
  'Jack Russell Terrier',
  'Cocker Spaniel',
  'Bulldog Inglês',
  'Akita',
  'Doberman',
  'Boxer',
  'Pitbull'
] as const;

export type DogBreed = typeof DOG_BREEDS[number];

export function isValidBreed(breed: string): breed is DogBreed {
  return DOG_BREEDS.includes(breed as DogBreed);
}

export function getBreedDisplayName(breed: DogBreed): string {
  return breed;
}
