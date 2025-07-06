import type { FamilyMember } from "../components/family-tree-canvas";

export interface LayoutNode {
  id: string;
  x: number;
  y: number;
  level: number;
  generation: number;
}

export function autoLayoutFamilyTree(members: FamilyMember[]): {
  [id: string]: { x: number; y: number };
} {
  const positions: { [id: string]: { x: number; y: number } } = {};

  if (members.length === 0) return positions;

  // Find root members (those with no parents)
  const rootMembers = members.filter((member) => member.parentIds.length === 0);

  if (rootMembers.length === 0) {
    // If no root members, just place everyone in a grid
    members.forEach((member, index) => {
      const cols = Math.ceil(Math.sqrt(members.length));
      const col = index % cols;
      const row = Math.floor(index / cols);
      positions[member.id] = {
        x: 200 + col * 200,
        y: 200 + row * 150,
      };
    });
    return positions;
  }

  // Group members by generation
  const generations: { [level: number]: FamilyMember[] } = {};
  const visited = new Set<string>();

  function assignGeneration(member: FamilyMember, level: number) {
    if (visited.has(member.id)) return;
    visited.add(member.id);

    if (!generations[level]) generations[level] = [];
    generations[level].push(member);

    // Find children
    const children = members.filter((m) => m.parentIds.includes(member.id));
    children.forEach((child) => assignGeneration(child, level + 1));
  }

  // Start with root members
  rootMembers.forEach((root) => assignGeneration(root, 0));

  // Position members by generation
  const levelHeight = 150;
  const memberWidth = 200;

  Object.keys(generations).forEach((levelStr) => {
    const level = parseInt(levelStr);
    const membersInLevel = generations[level];
    const totalWidth = membersInLevel.length * memberWidth;
    const startX = Math.max(100, (800 - totalWidth) / 2); // Center the generation

    membersInLevel.forEach((member, index) => {
      positions[member.id] = {
        x: startX + index * memberWidth,
        y: 100 + level * levelHeight,
      };
    });
  });

  return positions;
}

export function findOptimalSpousePosition(
  member: FamilyMember,
  spouse: FamilyMember,
  allMembers: FamilyMember[]
): { x: number; y: number } {
  // Position spouse next to the member
  const offset = 150;
  return {
    x: member.x + offset,
    y: member.y,
  };
}

export function exportFamilyTreeData(members: FamilyMember[]) {
  return {
    version: "1.0",
    exportDate: new Date().toISOString(),
    members,
  };
}

export function importFamilyTreeData(data: any): FamilyMember[] {
  if (!data || !data.members || !Array.isArray(data.members)) {
    throw new Error("Invalid family tree data format");
  }

  return data.members.map((member: any) => ({
    id: member.id || Date.now().toString(),
    name: member.name || "Unknown",
    birthDate: member.birthDate,
    deathDate: member.deathDate,
    gender: member.gender || "other",
    parentIds: member.parentIds || [],
    spouseIds: member.spouseIds || [],
    x: member.x || 0,
    y: member.y || 0,
  }));
}
