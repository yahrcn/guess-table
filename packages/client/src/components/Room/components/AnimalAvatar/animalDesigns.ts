import { indexFromCardId } from '../designHelpers';

export type AnimalExtra = 'none' | 'mane' | 'horn' | 'trunk' | 'longNeck' | 'shell' | 'beak' | 'wings';

export interface AnimalDesign {
  bg: string;
  fur: string;
  eyeColor: string;
  earStyle: 0 | 1 | 2;
  patternStyle: 0 | 1 | 2;
  patternColor: string;
  extra: AnimalExtra;
}

const FALLBACK: AnimalDesign = {
  bg: '#DCEFE0',
  fur: '#C68642',
  eyeColor: '#2b2118',
  earStyle: 0,
  patternStyle: 0,
  patternColor: '#8D5524',
  extra: 'none',
};

// One entry per card in packages/shared/src/cards.ts's ANIMALS deck, in the same order —
// every field chosen by hand to actually suit the animal (lion's mane, giraffe's neck,
// rhino's horn, etc.), never derived from hashing an id.
const ANIMAL_DESIGNS: AnimalDesign[] = [
  { bg: '#F6E6C8', fur: '#D9A55C', eyeColor: '#2b2118', earStyle: 0, patternStyle: 0, patternColor: '#8B5E2A', extra: 'mane' }, // Лев
  { bg: '#FCEFD9', fur: '#E8862E', eyeColor: '#2b2118', earStyle: 1, patternStyle: 2, patternColor: '#2B2118', extra: 'none' }, // Тигр
  { bg: '#E7ECEA', fur: '#A9AFAE', eyeColor: '#2b2118', earStyle: 0, patternStyle: 0, patternColor: '#7D8482', extra: 'trunk' }, // Слон
  { bg: '#FCEFD3', fur: '#E3B04B', eyeColor: '#2b2118', earStyle: 0, patternStyle: 1, patternColor: '#8B5A2B', extra: 'longNeck' }, // Жираф
  { bg: '#EDEDED', fur: '#F5F5F0', eyeColor: '#2b2118', earStyle: 0, patternStyle: 2, patternColor: '#1C1C1C', extra: 'none' }, // Зебра
  { bg: '#E9F2E6', fur: '#F7F7F2', eyeColor: '#1C1C1C', earStyle: 0, patternStyle: 1, patternColor: '#1C1C1C', extra: 'none' }, // Панда
  { bg: '#E4EDE9', fur: '#9FA8A6', eyeColor: '#2b2118', earStyle: 2, patternStyle: 0, patternColor: '#7C8482', extra: 'none' }, // Коала
  { bg: '#F3E6D2', fur: '#C68A52', eyeColor: '#2b2118', earStyle: 1, patternStyle: 0, patternColor: '#8B5A2B', extra: 'none' }, // Кенгуру
  { bg: '#E7ECF0', fur: '#8C949C', eyeColor: '#E3C56B', earStyle: 1, patternStyle: 0, patternColor: '#5B6168', extra: 'none' }, // Волк
  { bg: '#FCE9D6', fur: '#E06A2C', eyeColor: '#2b2118', earStyle: 1, patternStyle: 0, patternColor: '#FFFFFF', extra: 'none' }, // Лиса
  { bg: '#EFE4D6', fur: '#6B4A32', eyeColor: '#1C1C1C', earStyle: 0, patternStyle: 0, patternColor: '#4A3322', extra: 'none' }, // Медведь
  { bg: '#DDEFF5', fur: '#1C1C1C', eyeColor: '#FFFFFF', earStyle: 0, patternStyle: 0, patternColor: '#FFFFFF', extra: 'beak' }, // Пингвин
  { bg: '#D8EEF5', fur: '#6FA8C0', eyeColor: '#1C1C1C', earStyle: 0, patternStyle: 0, patternColor: '#4F85A0', extra: 'none' }, // Дельфин
  { bg: '#D3E7EC', fur: '#6E8B96', eyeColor: '#1C1C1C', earStyle: 1, patternStyle: 0, patternColor: '#4C6670', extra: 'none' }, // Акула
  { bg: '#EDE6DA', fur: '#7A5A3C', eyeColor: '#E3B13A', earStyle: 1, patternStyle: 0, patternColor: '#D9A441', extra: 'beak' }, // Орёл
  { bg: '#E8E1CF', fur: '#8C7352', eyeColor: '#E8C84A', earStyle: 1, patternStyle: 1, patternColor: '#5C4A32', extra: 'none' }, // Сова
  { bg: '#E4EDDC', fur: '#5E7A3C', eyeColor: '#D9C13A', earStyle: 0, patternStyle: 2, patternColor: '#3C5226', extra: 'none' }, // Крокодил
  { bg: '#E4EDDC', fur: '#6FA35A', eyeColor: '#1C1C1C', earStyle: 0, patternStyle: 0, patternColor: '#3F6B34', extra: 'shell' }, // Черепаха
  { bg: '#E3F0E0', fur: '#5FAE6E', eyeColor: '#E3D93A', earStyle: 0, patternStyle: 1, patternColor: '#2F7A3F', extra: 'none' }, // Хамелеон
  { bg: '#FBE3EC', fur: '#F28FB0', eyeColor: '#1C1C1C', earStyle: 0, patternStyle: 0, patternColor: '#D9607F', extra: 'beak' }, // Фламинго
  { bg: '#EDE3F0', fur: '#9A6AAE', eyeColor: '#FFFFFF', earStyle: 0, patternStyle: 1, patternColor: '#6E3F82', extra: 'none' }, // Осьминог
  { bg: '#FCE9F0', fur: '#D96AAE', eyeColor: '#1C1C1C', earStyle: 0, patternStyle: 1, patternColor: '#5B8FD9', extra: 'wings' }, // Бабочка
  { bg: '#FCF3D2', fur: '#F2C230', eyeColor: '#1C1C1C', earStyle: 0, patternStyle: 2, patternColor: '#1C1C1C', extra: 'wings' }, // Пчела
  { bg: '#EFE6D6', fur: '#A9824F', eyeColor: '#1C1C1C', earStyle: 1, patternStyle: 1, patternColor: '#5C4328', extra: 'none' }, // Ёж
  { bg: '#F6E9D2', fur: '#C06A3A', eyeColor: '#1C1C1C', earStyle: 1, patternStyle: 0, patternColor: '#8B4A24', extra: 'none' }, // Белка
  { bg: '#F6EFD8', fur: '#E3B868', eyeColor: '#1C1C1C', earStyle: 0, patternStyle: 1, patternColor: '#2B2118', extra: 'none' }, // Гепард
  { bg: '#F0E6D0', fur: '#D9A354', eyeColor: '#E3D93A', earStyle: 0, patternStyle: 1, patternColor: '#2B2118', extra: 'none' }, // Леопард
  { bg: '#E9E6DE', fur: '#9C9488', eyeColor: '#1C1C1C', earStyle: 0, patternStyle: 0, patternColor: '#5C5248', extra: 'horn' }, // Носорог
  { bg: '#E3E6EC', fur: '#8C92A4', eyeColor: '#1C1C1C', earStyle: 0, patternStyle: 0, patternColor: '#636980', extra: 'none' }, // Бегемот
  { bg: '#E6E3DC', fur: '#3C3630', eyeColor: '#1C1C1C', earStyle: 0, patternStyle: 0, patternColor: '#241F1A', extra: 'none' }, // Горилла
  { bg: '#EFE6D6', fur: '#6B4A32', eyeColor: '#1C1C1C', earStyle: 0, patternStyle: 0, patternColor: '#4A3322', extra: 'none' }, // Шимпанзе
  { bg: '#EDE6D4', fur: '#B49A6E', eyeColor: '#1C1C1C', earStyle: 2, patternStyle: 0, patternColor: '#8C7548', extra: 'none' }, // Ленивец
  { bg: '#DDEAEF', fur: '#7A5A3C', eyeColor: '#1C1C1C', earStyle: 0, patternStyle: 0, patternColor: '#5C4328', extra: 'none' }, // Выдра
  { bg: '#E9E6E0', fur: '#E8E4DC', eyeColor: '#1C1C1C', earStyle: 0, patternStyle: 2, patternColor: '#1C1C1C', extra: 'none' }, // Барсук
  { bg: '#E6E6E6', fur: '#8C8880', eyeColor: '#1C1C1C', earStyle: 1, patternStyle: 1, patternColor: '#2B2118', extra: 'none' }, // Енот
  { bg: '#EFE9D6', fur: '#A9714A', eyeColor: '#1C1C1C', earStyle: 1, patternStyle: 1, patternColor: '#7A4E2D', extra: 'horn' }, // Олень
  { bg: '#E6E0D2', fur: '#5C4A36', eyeColor: '#1C1C1C', earStyle: 1, patternStyle: 0, patternColor: '#4A3322', extra: 'horn' }, // Лось
  { bg: '#F3E8CE', fur: '#C9A268', eyeColor: '#1C1C1C', earStyle: 0, patternStyle: 0, patternColor: '#8B6A3C', extra: 'none' }, // Верблюд
  { bg: '#E6E0D6', fur: '#4A3C30', eyeColor: '#1C1C1C', earStyle: 0, patternStyle: 0, patternColor: '#2B2118', extra: 'horn' }, // Як
  { bg: '#EBE6DC', fur: '#8C7D68', eyeColor: '#1C1C1C', earStyle: 1, patternStyle: 0, patternColor: '#5C4F3E', extra: 'trunk' }, // Муравьед
  { bg: '#E6E6E6', fur: '#1C1C1C', eyeColor: '#1C1C1C', earStyle: 0, patternStyle: 2, patternColor: '#FFFFFF', extra: 'none' }, // Скунс
  { bg: '#EDE6D6', fur: '#8C7A5C', eyeColor: '#1C1C1C', earStyle: 1, patternStyle: 1, patternColor: '#2B2118', extra: 'none' }, // Дикобраз
  { bg: '#E3F0EC', fur: '#1C1C1C', eyeColor: '#FFFFFF', earStyle: 0, patternStyle: 0, patternColor: '#F2862E', extra: 'beak' }, // Тукан
  { bg: '#E3F0E0', fur: '#4FAE5E', eyeColor: '#1C1C1C', earStyle: 0, patternStyle: 1, patternColor: '#E8862E', extra: 'beak' }, // Попугай
  { bg: '#E3EEF0', fur: '#2E8F8C', eyeColor: '#1C1C1C', earStyle: 0, patternStyle: 1, patternColor: '#3F6BD9', extra: 'wings' }, // Павлин
  { bg: '#E8EEF0', fur: '#E8E4DC', eyeColor: '#1C1C1C', earStyle: 0, patternStyle: 0, patternColor: '#D98F3A', extra: 'beak' }, // Пеликан
  { bg: '#EDF0EC', fur: '#E8E4DC', eyeColor: '#1C1C1C', earStyle: 0, patternStyle: 0, patternColor: '#1C1C1C', extra: 'longNeck' }, // Журавль
  { bg: '#E8F0F0', fur: '#F7F7F2', eyeColor: '#1C1C1C', earStyle: 0, patternStyle: 0, patternColor: '#E8862E', extra: 'longNeck' }, // Лебедь
  { bg: '#E3E9EC', fur: '#9C8C6E', eyeColor: '#1C1C1C', earStyle: 0, patternStyle: 0, patternColor: '#F7F7F2', extra: 'horn' }, // Морж
  { bg: '#E3E9EC', fur: '#8C9499', eyeColor: '#1C1C1C', earStyle: 0, patternStyle: 0, patternColor: '#5C6468', extra: 'none' }, // Тюлень
];

export function getAnimalDesign(cardId: string): AnimalDesign {
  return ANIMAL_DESIGNS[indexFromCardId(cardId)] ?? FALLBACK;
}
