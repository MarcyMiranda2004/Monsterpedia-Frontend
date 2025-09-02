import apiFetch from "../type/ApiFetch";
import type { MonsterDto, CreateAndUpdateMonsterDto } from "../type/Monster";

const endpointBase = `/monsters`;

// Helper per convertire una monster in DTO
export const toMonsterDto = (monster: any): MonsterDto => ({
  id: monster.id,
  name: monster.name,
  category: monster.category,
  flavor: monster.flavor,
  origin: monster.origin,
  description: monster.description,
  story: monster.story,
  imageUrl: monster.imageUrl,
  marcyOpinion: monster.marcyOpinion,
});

// GET - lista monster (convertita in DTO)
export const getMonsters = async (): Promise<MonsterDto[]> => {
  const monsters = await apiFetch<any[]>(`${endpointBase}`);
  return monsters.map(toMonsterDto);
};

// GET - tutti le monster DTO (stessa logica di getMonsters se backend non ha /dto)
export const getAllMonsterDtos = async (): Promise<MonsterDto[]> => {
  const monsters = await apiFetch<any[]>(`${endpointBase}`);
  return monsters.map(toMonsterDto);
};

// GET - monster per ID
export const getMonsterById = async (id: number): Promise<MonsterDto> => {
  const monster = await apiFetch<any>(`${endpointBase}/${id}`);
  return toMonsterDto(monster);
};

// GET - ricerca monster DTO con query e paginazione
export const searchMonsterDtos = async (
  query: string,
  page: number = 0,
  size: number = 10
): Promise<{ content: MonsterDto[]; totalElements: number }> => {
  const response = await apiFetch<any>(
    `${endpointBase}?name=${encodeURIComponent(query)}&page=${page}&size=${size}`
  );
  return {
    content: response.content.map(toMonsterDto),
    totalElements: response.totalElements,
  };
};

// POST - crea nuova monster
export const createMonster = (data: CreateAndUpdateMonsterDto): Promise<MonsterDto> =>
  apiFetch<MonsterDto>(`${endpointBase}`, "POST", data);

// PUT - aggiorna monster
export const updateMonster = (id: number, data: CreateAndUpdateMonsterDto): Promise<MonsterDto> =>
  apiFetch<MonsterDto>(`${endpointBase}/${id}`, "PUT", data);

// DELETE - elimina monster
export const deleteMonster = (id: number): Promise<void> =>
  apiFetch<void>(`${endpointBase}/${id}`, "DELETE");
