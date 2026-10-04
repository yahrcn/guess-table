import { DeckId, type Card } from './types.js';

/**
 * Every deck's "portraits" are deterministically generated client-side from each card's
 * `seed` (see Avatar/AnimalAvatar/MediaAvatar) — never real photos, posters, box art or
 * logos. That's what keeps real names and titles (Celebrities/Movies/VideoGames) safe to
 * use here: we never reproduce anyone's actual likeness or any studio's artwork, only text.
 */

const FICTIONAL: Card[] = [
  { id: 'fictional-01', displayName: 'Алекс Нова', seed: 'alex-nova' },
  { id: 'fictional-02', displayName: 'Марина Вейл', seed: 'marina-veil' },
  { id: 'fictional-03', displayName: 'Дени Лорк', seed: 'deni-lork' },
  { id: 'fictional-04', displayName: 'Соня Брайт', seed: 'sonya-bright' },
  { id: 'fictional-05', displayName: 'Тимур Аксель', seed: 'timur-axel' },
  { id: 'fictional-06', displayName: 'Ирен Фальк', seed: 'iren-falk' },
  { id: 'fictional-07', displayName: 'Глеб Орсо', seed: 'gleb-orso' },
  { id: 'fictional-08', displayName: 'Ясна Рицци', seed: 'yasna-ricci' },
  { id: 'fictional-09', displayName: 'Марк Силва', seed: 'mark-silva' },
  { id: 'fictional-10', displayName: 'Лия Дорн', seed: 'liya-dorn' },
  { id: 'fictional-11', displayName: 'Виктор Эш', seed: 'viktor-ash' },
  { id: 'fictional-12', displayName: 'Ника Рейн', seed: 'nika-rain' },
  { id: 'fictional-13', displayName: 'Савва Крон', seed: 'savva-kron' },
  { id: 'fictional-14', displayName: 'Эмма Квест', seed: 'emma-kvest' },
  { id: 'fictional-15', displayName: 'Данте Моро', seed: 'dante-moro' },
  { id: 'fictional-16', displayName: 'Агата Лунд', seed: 'agata-lund' },
  { id: 'fictional-17', displayName: 'Рубен Стам', seed: 'ruben-stam' },
  { id: 'fictional-18', displayName: 'Вера Остин', seed: 'vera-austin' },
  { id: 'fictional-19', displayName: 'Леон Фарбер', seed: 'leon-farber' },
  { id: 'fictional-20', displayName: 'Клара Веско', seed: 'clara-vesco' },
  { id: 'fictional-21', displayName: 'Игорь Блэйз', seed: 'igor-blaze' },
  { id: 'fictional-22', displayName: 'Милана Соль', seed: 'milana-sol' },
  { id: 'fictional-23', displayName: 'Фёдор Айс', seed: 'fedor-ice' },
  { id: 'fictional-24', displayName: 'Таня Норд', seed: 'tanya-nord' },
  { id: 'fictional-25', displayName: 'Оскар Рейв', seed: 'oscar-reve' },
];

// Long-deceased historical figures only — no living-person likeness/publicity concerns,
// and we draw a generated face, never a real portrait, so there's no photo to clear either.
const CELEBRITIES: Card[] = [
  { id: 'celebrity-01', displayName: 'Альберт Эйнштейн', seed: 'celebrity-01' },
  { id: 'celebrity-02', displayName: 'Леонардо да Винчи', seed: 'celebrity-02' },
  { id: 'celebrity-03', displayName: 'Исаак Ньютон', seed: 'celebrity-03' },
  { id: 'celebrity-04', displayName: 'Мария Кюри', seed: 'celebrity-04' },
  { id: 'celebrity-05', displayName: 'Чарльз Дарвин', seed: 'celebrity-05' },
  { id: 'celebrity-06', displayName: 'Никола Тесла', seed: 'celebrity-06' },
  { id: 'celebrity-07', displayName: 'Вольфганг Амадей Моцарт', seed: 'celebrity-07' },
  { id: 'celebrity-08', displayName: 'Людвиг ван Бетховен', seed: 'celebrity-08' },
  { id: 'celebrity-09', displayName: 'Уильям Шекспир', seed: 'celebrity-09' },
  { id: 'celebrity-10', displayName: 'Александр Пушкин', seed: 'celebrity-10' },
  { id: 'celebrity-11', displayName: 'Клеопатра', seed: 'celebrity-11' },
  { id: 'celebrity-12', displayName: 'Юлий Цезарь', seed: 'celebrity-12' },
  { id: 'celebrity-13', displayName: 'Жанна д’Арк', seed: 'celebrity-13' },
  { id: 'celebrity-14', displayName: 'Христофор Колумб', seed: 'celebrity-14' },
  { id: 'celebrity-15', displayName: 'Галилео Галилей', seed: 'celebrity-15' },
  { id: 'celebrity-16', displayName: 'Чарли Чаплин', seed: 'celebrity-16' },
  { id: 'celebrity-17', displayName: 'Фрида Кало', seed: 'celebrity-17' },
  { id: 'celebrity-18', displayName: 'Винсент Ван Гог', seed: 'celebrity-18' },
  { id: 'celebrity-19', displayName: 'Пабло Пикассо', seed: 'celebrity-19' },
  { id: 'celebrity-20', displayName: 'Нильс Бор', seed: 'celebrity-20' },
  { id: 'celebrity-21', displayName: 'Зигмунд Фрейд', seed: 'celebrity-21' },
  { id: 'celebrity-22', displayName: 'Конфуций', seed: 'celebrity-22' },
  { id: 'celebrity-23', displayName: 'Платон', seed: 'celebrity-23' },
  { id: 'celebrity-24', displayName: 'Аристотель', seed: 'celebrity-24' },
  { id: 'celebrity-25', displayName: 'Клод Моне', seed: 'celebrity-25' },
];

const ANIMALS: Card[] = [
  { id: 'animal-01', displayName: 'Лев', seed: 'animal-01' },
  { id: 'animal-02', displayName: 'Тигр', seed: 'animal-02' },
  { id: 'animal-03', displayName: 'Слон', seed: 'animal-03' },
  { id: 'animal-04', displayName: 'Жираф', seed: 'animal-04' },
  { id: 'animal-05', displayName: 'Зебра', seed: 'animal-05' },
  { id: 'animal-06', displayName: 'Панда', seed: 'animal-06' },
  { id: 'animal-07', displayName: 'Коала', seed: 'animal-07' },
  { id: 'animal-08', displayName: 'Кенгуру', seed: 'animal-08' },
  { id: 'animal-09', displayName: 'Волк', seed: 'animal-09' },
  { id: 'animal-10', displayName: 'Лиса', seed: 'animal-10' },
  { id: 'animal-11', displayName: 'Медведь', seed: 'animal-11' },
  { id: 'animal-12', displayName: 'Пингвин', seed: 'animal-12' },
  { id: 'animal-13', displayName: 'Дельфин', seed: 'animal-13' },
  { id: 'animal-14', displayName: 'Акула', seed: 'animal-14' },
  { id: 'animal-15', displayName: 'Орёл', seed: 'animal-15' },
  { id: 'animal-16', displayName: 'Сова', seed: 'animal-16' },
  { id: 'animal-17', displayName: 'Крокодил', seed: 'animal-17' },
  { id: 'animal-18', displayName: 'Черепаха', seed: 'animal-18' },
  { id: 'animal-19', displayName: 'Хамелеон', seed: 'animal-19' },
  { id: 'animal-20', displayName: 'Фламинго', seed: 'animal-20' },
  { id: 'animal-21', displayName: 'Осьминог', seed: 'animal-21' },
  { id: 'animal-22', displayName: 'Бабочка', seed: 'animal-22' },
  { id: 'animal-23', displayName: 'Пчела', seed: 'animal-23' },
  { id: 'animal-24', displayName: 'Ёж', seed: 'animal-24' },
  { id: 'animal-25', displayName: 'Белка', seed: 'animal-25' },
];

const PROFESSIONS: Card[] = [
  { id: 'profession-01', displayName: 'Врач', seed: 'profession-01' },
  { id: 'profession-02', displayName: 'Учитель', seed: 'profession-02' },
  { id: 'profession-03', displayName: 'Пожарный', seed: 'profession-03' },
  { id: 'profession-04', displayName: 'Полицейский', seed: 'profession-04' },
  { id: 'profession-05', displayName: 'Повар', seed: 'profession-05' },
  { id: 'profession-06', displayName: 'Пилот', seed: 'profession-06' },
  { id: 'profession-07', displayName: 'Музыкант', seed: 'profession-07' },
  { id: 'profession-08', displayName: 'Художник', seed: 'profession-08' },
  { id: 'profession-09', displayName: 'Писатель', seed: 'profession-09' },
  { id: 'profession-10', displayName: 'Программист', seed: 'profession-10' },
  { id: 'profession-11', displayName: 'Строитель', seed: 'profession-11' },
  { id: 'profession-12', displayName: 'Фотограф', seed: 'profession-12' },
  { id: 'profession-13', displayName: 'Актёр', seed: 'profession-13' },
  { id: 'profession-14', displayName: 'Юрист', seed: 'profession-14' },
  { id: 'profession-15', displayName: 'Инженер', seed: 'profession-15' },
  { id: 'profession-16', displayName: 'Моряк', seed: 'profession-16' },
  { id: 'profession-17', displayName: 'Почтальон', seed: 'profession-17' },
  { id: 'profession-18', displayName: 'Парикмахер', seed: 'profession-18' },
  { id: 'profession-19', displayName: 'Садовник', seed: 'profession-19' },
  { id: 'profession-20', displayName: 'Ветеринар', seed: 'profession-20' },
  { id: 'profession-21', displayName: 'Космонавт', seed: 'profession-21' },
  { id: 'profession-22', displayName: 'Археолог', seed: 'profession-22' },
  { id: 'profession-23', displayName: 'Детектив', seed: 'profession-23' },
  { id: 'profession-24', displayName: 'Фермер', seed: 'profession-24' },
  { id: 'profession-25', displayName: 'Спортсмен', seed: 'profession-25' },
];

// Titles only — no posters, stills or logos are reproduced anywhere in this app.
const MOVIES: Card[] = [
  { id: 'movie-01', displayName: 'Титаник', seed: 'movie-01' },
  { id: 'movie-02', displayName: 'Матрица', seed: 'movie-02' },
  { id: 'movie-03', displayName: 'Крёстный отец', seed: 'movie-03' },
  { id: 'movie-04', displayName: 'Побег из Шоушенка', seed: 'movie-04' },
  { id: 'movie-05', displayName: 'Форрест Гамп', seed: 'movie-05' },
  { id: 'movie-06', displayName: 'Бойцовский клуб', seed: 'movie-06' },
  { id: 'movie-07', displayName: 'Интерстеллар', seed: 'movie-07' },
  { id: 'movie-08', displayName: 'Начало', seed: 'movie-08' },
  { id: 'movie-09', displayName: 'Гладиатор', seed: 'movie-09' },
  { id: 'movie-10', displayName: 'Король Лев', seed: 'movie-10' },
  { id: 'movie-11', displayName: 'Джокер', seed: 'movie-11' },
  { id: 'movie-12', displayName: 'Терминатор', seed: 'movie-12' },
  { id: 'movie-13', displayName: 'Чужой', seed: 'movie-13' },
  { id: 'movie-14', displayName: 'Молчание ягнят', seed: 'movie-14' },
  { id: 'movie-15', displayName: 'Список Шиндлера', seed: 'movie-15' },
  { id: 'movie-16', displayName: 'Назад в будущее', seed: 'movie-16' },
  { id: 'movie-17', displayName: 'Пираты Карибского моря', seed: 'movie-17' },
  { id: 'movie-18', displayName: 'Касабланка', seed: 'movie-18' },
  { id: 'movie-19', displayName: 'Иван Васильевич меняет профессию', seed: 'movie-19' },
  { id: 'movie-20', displayName: 'Бриллиантовая рука', seed: 'movie-20' },
  { id: 'movie-21', displayName: 'Операция «Ы»', seed: 'movie-21' },
  { id: 'movie-22', displayName: 'Ирония судьбы', seed: 'movie-22' },
  { id: 'movie-23', displayName: 'Москва слезам не верит', seed: 'movie-23' },
  { id: 'movie-24', displayName: 'Кавказская пленница', seed: 'movie-24' },
  { id: 'movie-25', displayName: 'Джентльмены удачи', seed: 'movie-25' },
];

// Titles only — no box art, sprites or logos are reproduced anywhere in this app.
const VIDEO_GAMES: Card[] = [
  { id: 'game-01', displayName: 'Тетрис', seed: 'game-01' },
  { id: 'game-02', displayName: 'Марио', seed: 'game-02' },
  { id: 'game-03', displayName: 'Соник', seed: 'game-03' },
  { id: 'game-04', displayName: 'Пакман', seed: 'game-04' },
  { id: 'game-05', displayName: 'Minecraft', seed: 'game-05' },
  { id: 'game-06', displayName: 'Fortnite', seed: 'game-06' },
  { id: 'game-07', displayName: 'Ведьмак 3', seed: 'game-07' },
  { id: 'game-08', displayName: 'Dota 2', seed: 'game-08' },
  { id: 'game-09', displayName: 'Counter-Strike', seed: 'game-09' },
  { id: 'game-10', displayName: 'Warcraft III', seed: 'game-10' },
  { id: 'game-11', displayName: 'S.T.A.L.K.E.R.', seed: 'game-11' },
  { id: 'game-12', displayName: 'Portal', seed: 'game-12' },
  { id: 'game-13', displayName: 'Half-Life', seed: 'game-13' },
  { id: 'game-14', displayName: 'SimCity', seed: 'game-14' },
  { id: 'game-15', displayName: 'Civilization', seed: 'game-15' },
  { id: 'game-16', displayName: 'Crash Bandicoot', seed: 'game-16' },
  { id: 'game-17', displayName: 'Among Us', seed: 'game-17' },
  { id: 'game-18', displayName: 'GTA V', seed: 'game-18' },
  { id: 'game-19', displayName: 'Resident Evil', seed: 'game-19' },
  { id: 'game-20', displayName: 'Elden Ring', seed: 'game-20' },
  { id: 'game-21', displayName: 'Red Dead Redemption 2', seed: 'game-21' },
  { id: 'game-22', displayName: 'Overwatch', seed: 'game-22' },
  { id: 'game-23', displayName: 'League of Legends', seed: 'game-23' },
  { id: 'game-24', displayName: 'Pokémon', seed: 'game-24' },
  { id: 'game-25', displayName: 'Angry Birds', seed: 'game-25' },
];

export const CARD_DECKS: Record<DeckId, Card[]> = {
  [DeckId.Fictional]: FICTIONAL,
  [DeckId.Celebrities]: CELEBRITIES,
  [DeckId.Animals]: ANIMALS,
  [DeckId.Professions]: PROFESSIONS,
  [DeckId.Movies]: MOVIES,
  [DeckId.VideoGames]: VIDEO_GAMES,
};

export const DECK_LABELS: Record<DeckId, string> = {
  [DeckId.Fictional]: 'Вымышленные персонажи',
  [DeckId.Celebrities]: 'Известные личности',
  [DeckId.Animals]: 'Животные',
  [DeckId.Professions]: 'Профессии',
  [DeckId.Movies]: 'Фильмы',
  [DeckId.VideoGames]: 'Видеоигры',
};

export const DEFAULT_DECK_ID = DeckId.Fictional;

export function getDeckCards(deckId: DeckId): Card[] {
  return CARD_DECKS[deckId];
}

export function isValidDeckId(value: string): value is DeckId {
  return (Object.values(DeckId) as string[]).includes(value);
}
