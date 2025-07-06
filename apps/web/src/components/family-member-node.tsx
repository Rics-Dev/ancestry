import { createSignal, Show } from "solid-js";
import type { FamilyMember } from "./family-tree-canvas";

interface FamilyMemberNodeProps {
  member: FamilyMember;
  isSelected: boolean;
  onSelect: (member: FamilyMember | null) => void;
  onMove: (id: string, x: number, y: number) => void;
  onUpdate: (member: FamilyMember) => void;
  onDelete: (id: string) => void;
  onEdit: (member: FamilyMember) => void;
  allMembers: FamilyMember[];
}

export function FamilyMemberNode(props: FamilyMemberNodeProps) {
  const [isDragging, setIsDragging] = createSignal(false);
  const [dragStart, setDragStart] = createSignal({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = createSignal(false);

  const handleMouseDown = (e: MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - props.member.x,
      y: e.clientY - props.member.y,
    });

    props.onSelect(props.member);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (isDragging()) {
        const newX = moveEvent.clientX - dragStart().x;
        const newY = moveEvent.clientY - dragStart().y;
        props.onMove(props.member.id, newX, newY);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    props.onSelect(props.member);
  };

  const getGenderColor = () => {
    switch (props.member.gender) {
      case "male":
        return "bg-blue-600 border-blue-500";
      case "female":
        return "bg-pink-600 border-pink-500";
      default:
        return "bg-purple-600 border-purple-500";
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return "";
    return new Date(date).getFullYear().toString();
  };

  const getAgeInfo = () => {
    if (!props.member.birthDate) return "";

    const birthYear = new Date(props.member.birthDate).getFullYear();
    const currentYear = props.member.deathDate
      ? new Date(props.member.deathDate).getFullYear()
      : new Date().getFullYear();

    const age = currentYear - birthYear;
    return props.member.deathDate ? `(${age})` : `(${age})`;
  };

  return (
    <div
      class={`absolute select-none cursor-move transition-all duration-200 ${
        props.isSelected ? "z-20 scale-105" : "z-10"
      }`}
      style={{
        left: `${props.member.x - 60}px`,
        top: `${props.member.y - 40}px`,
        width: "120px",
        height: "80px",
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Node container */}
      <div
        class={`
          w-full h-full rounded-lg border-2 shadow-lg flex flex-col items-center justify-center text-white text-xs
          transition-all duration-200 hover:shadow-xl
          ${getGenderColor()}
          ${props.isSelected ? "ring-2 ring-yellow-400 ring-offset-2 ring-offset-neutral-900" : ""}
          ${isDragging() ? "opacity-75" : ""}
        `}
      >
        <div class="font-semibold text-center leading-tight px-1 truncate w-full">
          {props.member.name}
        </div>
        <div class="text-xs opacity-90 mt-1">
          {formatDate(props.member.birthDate)}
          {props.member.deathDate && ` - ${formatDate(props.member.deathDate)}`}
        </div>
        <div class="text-xs opacity-75">{getAgeInfo()}</div>
      </div>

      {/* Tooltip */}
      <Show when={showTooltip() && !isDragging()}>
        <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-neutral-800 text-white text-sm rounded-lg shadow-lg border border-neutral-700 whitespace-nowrap z-30">
          <div class="font-semibold">{props.member.name}</div>
          <Show when={props.member.birthDate}>
            <div>Born: {props.member.birthDate}</div>
          </Show>
          <Show when={props.member.deathDate}>
            <div>Died: {props.member.deathDate}</div>
          </Show>
          <div>Gender: {props.member.gender}</div>
          <Show when={props.member.parentIds.length > 0}>
            <div>Parents: {props.member.parentIds.length}</div>
          </Show>
          <Show when={props.member.spouseIds.length > 0}>
            <div>Spouses: {props.member.spouseIds.length}</div>
          </Show>

          {/* Tooltip arrow */}
          <div class="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-neutral-800"></div>
        </div>
      </Show>

      {/* Selection menu */}
      <Show when={props.isSelected}>
        <div class="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 flex gap-1 z-30">
          <button
            onClick={(e) => {
              e.stopPropagation();
              props.onEdit(props.member);
            }}
            class="px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`Delete ${props.member.name}?`)) {
                props.onDelete(props.member.id);
              }
            }}
            class="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
          >
            Delete
          </button>
        </div>
      </Show>
    </div>
  );
}
