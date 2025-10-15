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
  'Maltês'
] as const;

export type DogBreed = typeof DOG_BREEDS[number];

export function isValidBreed(breed: string): breed is DogBreed {
  return DOG_BREEDS.includes(breed as DogBreed);
}
