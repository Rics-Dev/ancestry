import { createSignal, onMount, For, Show } from "solid-js";
import { FamilyTreeHelp } from "./family-tree-help";
import {
  autoLayoutFamilyTree,
  exportFamilyTreeData,
  importFamilyTreeData,
} from "../utils/family-tree-utils";
import { FamilyMemberNode } from "./family-member-node";
import { FamilyMemberForm } from "./family-member-form";

export interface FamilyMember {
  id: string;
  name: string;
  birthDate?: string;
  deathDate?: string;
  gender: "male" | "female" | "other";
  parentIds: string[];
  spouseIds: string[];
  x: number;
  y: number;
}

export interface Connection {
  from: string;
  to: string;
  type: "parent" | "spouse";
}

export function FamilyTreeCanvas() {
  const [familyMembers, setFamilyMembers] = createSignal<FamilyMember[]>([]);
  const [connections, setConnections] = createSignal<Connection[]>([]);
  const [selectedMember, setSelectedMember] = createSignal<FamilyMember | null>(
    null
  );
  const [showForm, setShowForm] = createSignal(false);
  const [editingMember, setEditingMember] = createSignal<FamilyMember | null>(
    null
  );
  const [canvasSize, setCanvasSize] = createSignal({ width: 0, height: 0 });
  const [zoom, setZoom] = createSignal(1);
  const [pan, setPan] = createSignal({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = createSignal(false);
  const [panStart, setPanStart] = createSignal({ x: 0, y: 0 });

  let canvasRef: HTMLDivElement | undefined;
  let svgRef: SVGSVGElement | undefined;

  onMount(() => {
    const updateCanvasSize = () => {
      if (canvasRef) {
        setCanvasSize({
          width: canvasRef.clientWidth,
          height: canvasRef.clientHeight,
        });
      }
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    // Load saved data from localStorage
    try {
      const savedData = localStorage.getItem("family-tree-data");
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        const loadedMembers = importFamilyTreeData(parsedData);
        if (loadedMembers.length > 0) {
          setFamilyMembers(loadedMembers);
          updateConnections();
          return () => window.removeEventListener("resize", updateCanvasSize);
        }
      }
    } catch (error) {
      console.warn("Failed to load saved family tree data:", error);
    }

    // Add some sample data if no saved data exists
    const sampleMembers: FamilyMember[] = [
      {
        id: "1",
        name: "John Doe",
        birthDate: "1950-01-01",
        gender: "male",
        parentIds: [],
        spouseIds: ["2"],
        x: 400,
        y: 200,
      },
      {
        id: "2",
        name: "Jane Doe",
        birthDate: "1952-05-15",
        gender: "female",
        parentIds: [],
        spouseIds: ["1"],
        x: 600,
        y: 200,
      },
      {
        id: "3",
        name: "Bob Doe",
        birthDate: "1975-03-10",
        gender: "male",
        parentIds: ["1", "2"],
        spouseIds: [],
        x: 500,
        y: 350,
      },
    ];

    setFamilyMembers(sampleMembers);
    updateConnections();

    return () => window.removeEventListener("resize", updateCanvasSize);
  });

  const updateConnections = () => {
    const newConnections: Connection[] = [];

    familyMembers().forEach((member) => {
      // Parent connections
      member.parentIds.forEach((parentId) => {
        newConnections.push({
          from: parentId,
          to: member.id,
          type: "parent",
        });
      });

      // Spouse connections
      member.spouseIds.forEach((spouseId) => {
        // Only add connection if it doesn't already exist (to avoid duplicates)
        if (
          !newConnections.some(
            (conn) =>
              (conn.from === member.id && conn.to === spouseId) ||
              (conn.from === spouseId && conn.to === member.id)
          )
        ) {
          newConnections.push({
            from: member.id,
            to: spouseId,
            type: "spouse",
          });
        }
      });
    });

    setConnections(newConnections);

    // Auto-save to localStorage
    try {
      const dataToSave = exportFamilyTreeData(familyMembers());
      localStorage.setItem("family-tree-data", JSON.stringify(dataToSave));
    } catch (error) {
      console.warn("Failed to save family tree data:", error);
    }
  };

  const addFamilyMember = (member: Omit<FamilyMember, "id" | "x" | "y">) => {
    const newMember: FamilyMember = {
      ...member,
      id: Date.now().toString(),
      x: canvasSize().width / 2,
      y: canvasSize().height / 2,
    };

    setFamilyMembers((prev) => [...prev, newMember]);
    updateConnections();
    setShowForm(false);
    setEditingMember(null);
  };

  const editMember = (memberData: Omit<FamilyMember, "id" | "x" | "y">) => {
    const editing = editingMember();
    if (editing) {
      const updatedMember: FamilyMember = {
        ...memberData,
        id: editing.id,
        x: editing.x,
        y: editing.y,
      };
      updateFamilyMember(updatedMember);
      setShowForm(false);
      setEditingMember(null);
    }
  };

  const handleFormSubmit = (member: Omit<FamilyMember, "id" | "x" | "y">) => {
    if (editingMember()) {
      editMember(member);
    } else {
      addFamilyMember(member);
    }
  };

  const openEditForm = (member: FamilyMember) => {
    setEditingMember(member);
    setShowForm(true);
  };

  const updateFamilyMember = (updatedMember: FamilyMember) => {
    setFamilyMembers((prev) =>
      prev.map((member) =>
        member.id === updatedMember.id ? updatedMember : member
      )
    );
    updateConnections();
  };

  const deleteFamilyMember = (id: string) => {
    setFamilyMembers((prev) => prev.filter((member) => member.id !== id));
    setSelectedMember(null);
    updateConnections();
  };

  const handleMemberMove = (id: string, x: number, y: number) => {
    setFamilyMembers((prev) =>
      prev.map((member) => (member.id === id ? { ...member, x, y } : member))
    );
    // Auto-save after move
    setTimeout(() => updateConnections(), 100);
  };

  const handleCanvasClick = (e: MouseEvent) => {
    if (e.target === canvasRef || e.target === svgRef) {
      setSelectedMember(null);
    }
  };

  const handleCanvasMouseDown = (e: MouseEvent) => {
    // Only start panning if clicking on the canvas itself, not on a family member
    if (e.target === canvasRef || e.target === svgRef) {
      setIsPanning(true);
      setPanStart({
        x: e.clientX - pan().x,
        y: e.clientY - pan().y,
      });

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (isPanning()) {
          setPan({
            x: moveEvent.clientX - panStart().x,
            y: moveEvent.clientY - panStart().y,
          });
        }
      };

      const handleMouseUp = () => {
        setIsPanning(false);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((prev) => Math.max(0.1, Math.min(3, prev * delta)));
  };

  const autoLayout = () => {
    const positions = autoLayoutFamilyTree(familyMembers());
    setFamilyMembers((prev) =>
      prev.map((member) => ({
        ...member,
        x: positions[member.id]?.x || member.x,
        y: positions[member.id]?.y || member.y,
      }))
    );
  };

  const exportData = () => {
    const data = exportFamilyTreeData(familyMembers());
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `family-tree-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            const importedMembers = importFamilyTreeData(data);
            setFamilyMembers(importedMembers);
            updateConnections();
          } catch (error) {
            alert("Error importing file: " + error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const clearAllData = () => {
    if (
      confirm(
        "Are you sure you want to clear all family tree data? This cannot be undone."
      )
    ) {
      setFamilyMembers([]);
      setConnections([]);
      setSelectedMember(null);
      localStorage.removeItem("family-tree-data");
    }
  };

  const getConnectionPath = (
    from: FamilyMember,
    to: FamilyMember,
    type: "parent" | "spouse"
  ) => {
    // Use original positions since the SVG is already transformed with the canvas
    const fromX = from.x;
    const fromY = from.y;
    const toX = to.x;
    const toY = to.y;

    if (type === "spouse") {
      // Straight line for spouses
      return `M ${fromX} ${fromY} L ${toX} ${toY}`;
    } else {
      // Curved line for parent-child relationships
      const midY = (fromY + toY) / 2;
      return `M ${fromX} ${fromY} Q ${fromX} ${midY} ${(fromX + toX) / 2} ${midY} Q ${toX} ${midY} ${toX} ${toY}`;
    }
  };

  return (
    <div class="relative w-full h-full bg-neutral-900">
      {/* Toolbar */}
      <div class="absolute top-4 left-4 z-10 space-y-2">
        <div class="flex gap-2 flex-wrap">
          <button
            onClick={() => setShowForm(true)}
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Add Member
          </button>
          <button
            onClick={autoLayout}
            class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            Auto Layout
          </button>
          <button
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
            class="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors"
          >
            Reset View
          </button>
        </div>
        <div class="flex gap-2 flex-wrap">
          <button
            onClick={exportData}
            class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Export
          </button>
          <button
            onClick={importData}
            class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
          >
            Import
          </button>
          <button
            onClick={clearAllData}
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Zoom controls and info */}
      <div class="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <div class="bg-neutral-800 px-3 py-2 rounded-lg text-white text-sm">
          Members: {familyMembers().length}
        </div>
        <button
          onClick={() => setZoom((prev) => Math.min(3, prev * 1.2))}
          class="w-10 h-10 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors flex items-center justify-center"
        >
          +
        </button>
        <div class="text-white text-sm text-center bg-neutral-800 px-2 py-1 rounded">
          {Math.round(zoom() * 100)}%
        </div>
        <button
          onClick={() => setZoom((prev) => Math.max(0.1, prev / 1.2))}
          class="w-10 h-10 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors flex items-center justify-center"
        >
          -
        </button>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef!}
        class="w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
        onClick={handleCanvasClick}
        onMouseDown={handleCanvasMouseDown}
        onWheel={handleWheel}
        style={{
          transform: `scale(${zoom()}) translate(${pan().x}px, ${pan().y}px)`,
          "transform-origin": "top left",
        }}
      >
        {/* SVG for connections */}
        <svg
          ref={svgRef!}
          class="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            width: `${canvasSize().width}px`,
            height: `${canvasSize().height}px`,
          }}
        >
          <For each={connections()}>
            {(connection) => {
              const fromMember = familyMembers().find(
                (m) => m.id === connection.from
              );
              const toMember = familyMembers().find(
                (m) => m.id === connection.to
              );

              if (!fromMember || !toMember) return null;

              return (
                <path
                  d={getConnectionPath(fromMember, toMember, connection.type)}
                  stroke={connection.type === "spouse" ? "#10b981" : "#3b82f6"}
                  stroke-width="2"
                  fill="none"
                  stroke-dasharray={
                    connection.type === "spouse" ? "5,5" : "none"
                  }
                />
              );
            }}
          </For>
        </svg>

        {/* Family member nodes */}
        <For each={familyMembers()}>
          {(member) => (
            <FamilyMemberNode
              member={member}
              isSelected={selectedMember()?.id === member.id}
              onSelect={setSelectedMember}
              onMove={handleMemberMove}
              onUpdate={updateFamilyMember}
              onDelete={deleteFamilyMember}
              onEdit={openEditForm}
              allMembers={familyMembers()}
            />
          )}
        </For>
      </div>

      {/* Help button */}
      <FamilyTreeHelp />

      {/* Family member form modal */}
      <Show when={showForm()}>
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-neutral-800 p-6 rounded-lg max-w-md w-full mx-4">
            <FamilyMemberForm
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingMember(null);
              }}
              existingMembers={familyMembers()}
              editingMember={editingMember() || undefined}
            />
          </div>
        </div>
      </Show>
    </div>
  );
}
