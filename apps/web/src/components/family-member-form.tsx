import { createSignal, For, Show } from "solid-js";
import type { FamilyMember } from "./family-tree-canvas";

interface FamilyMemberFormProps {
  onSubmit: (member: Omit<FamilyMember, "id" | "x" | "y">) => void;
  onCancel: () => void;
  existingMembers: FamilyMember[];
  editingMember?: FamilyMember;
}

export function FamilyMemberForm(props: FamilyMemberFormProps) {
  const [name, setName] = createSignal(props.editingMember?.name || "");
  const [birthDate, setBirthDate] = createSignal(
    props.editingMember?.birthDate || ""
  );
  const [deathDate, setDeathDate] = createSignal(
    props.editingMember?.deathDate || ""
  );
  const [gender, setGender] = createSignal<"male" | "female" | "other">(
    props.editingMember?.gender || "male"
  );
  const [selectedParents, setSelectedParents] = createSignal<string[]>(
    props.editingMember?.parentIds || []
  );
  const [selectedSpouses, setSelectedSpouses] = createSignal<string[]>(
    props.editingMember?.spouseIds || []
  );

  const availableParents = () =>
    props.existingMembers.filter(
      (member) => member.id !== props.editingMember?.id
    );

  const availableSpouses = () =>
    props.existingMembers.filter(
      (member) =>
        member.id !== props.editingMember?.id &&
        !selectedParents().includes(member.id)
    );

  const handleSubmit = (e: Event) => {
    e.preventDefault();

    if (!name().trim()) {
      alert("Name is required");
      return;
    }

    props.onSubmit({
      name: name().trim(),
      birthDate: birthDate() || undefined,
      deathDate: deathDate() || undefined,
      gender: gender(),
      parentIds: selectedParents(),
      spouseIds: selectedSpouses(),
    });
  };

  const toggleParent = (parentId: string) => {
    setSelectedParents((prev) =>
      prev.includes(parentId)
        ? prev.filter((id) => id !== parentId)
        : [...prev, parentId]
    );
  };

  const toggleSpouse = (spouseId: string) => {
    setSelectedSpouses((prev) =>
      prev.includes(spouseId)
        ? prev.filter((id) => id !== spouseId)
        : [...prev, spouseId]
    );
  };

  return (
    <form onSubmit={handleSubmit} class="space-y-4">
      <h2 class="text-xl font-bold text-white mb-4">
        {props.editingMember ? "Edit Family Member" : "Add Family Member"}
      </h2>

      {/* Name */}
      <div>
        <label class="block text-sm font-medium text-neutral-300 mb-1">
          Name *
        </label>
        <input
          type="text"
          value={name()}
          onInput={(e) => setName(e.currentTarget.value)}
          placeholder="Enter full name"
          class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:border-blue-500 focus:outline-none"
          required
        />
      </div>

      {/* Gender */}
      <div>
        <label class="block text-sm font-medium text-neutral-300 mb-1">
          Gender
        </label>
        <select
          value={gender()}
          onChange={(e) =>
            setGender(e.currentTarget.value as "male" | "female" | "other")
          }
          class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Birth Date */}
      <div>
        <label class="block text-sm font-medium text-neutral-300 mb-1">
          Birth Date
        </label>
        <input
          type="date"
          value={birthDate()}
          onInput={(e) => setBirthDate(e.currentTarget.value)}
          class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Death Date */}
      <div>
        <label class="block text-sm font-medium text-neutral-300 mb-1">
          Death Date (optional)
        </label>
        <input
          type="date"
          value={deathDate()}
          onInput={(e) => setDeathDate(e.currentTarget.value)}
          class="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Parents */}
      <Show when={availableParents().length > 0}>
        <div>
          <label class="block text-sm font-medium text-neutral-300 mb-2">
            Parents
          </label>
          <div class="space-y-2 max-h-32 overflow-y-auto">
            <For each={availableParents()}>
              {(member) => (
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedParents().includes(member.id)}
                    onChange={() => toggleParent(member.id)}
                    class="w-4 h-4 text-blue-600 bg-neutral-700 border-neutral-600 rounded focus:ring-blue-500"
                  />
                  <span class="text-sm text-white">
                    {member.name} ({member.gender},{" "}
                    {member.birthDate
                      ? new Date(member.birthDate).getFullYear()
                      : "Unknown"}
                    )
                  </span>
                </label>
              )}
            </For>
          </div>
        </div>
      </Show>

      {/* Spouses */}
      <Show when={availableSpouses().length > 0}>
        <div>
          <label class="block text-sm font-medium text-neutral-300 mb-2">
            Spouses
          </label>
          <div class="space-y-2 max-h-32 overflow-y-auto">
            <For each={availableSpouses()}>
              {(member) => (
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedSpouses().includes(member.id)}
                    onChange={() => toggleSpouse(member.id)}
                    class="w-4 h-4 text-blue-600 bg-neutral-700 border-neutral-600 rounded focus:ring-blue-500"
                  />
                  <span class="text-sm text-white">
                    {member.name} ({member.gender},{" "}
                    {member.birthDate
                      ? new Date(member.birthDate).getFullYear()
                      : "Unknown"}
                    )
                  </span>
                </label>
              )}
            </For>
          </div>
        </div>
      </Show>

      {/* Form buttons */}
      <div class="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={props.onCancel}
          class="px-4 py-2 bg-neutral-600 hover:bg-neutral-700 text-white rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          {props.editingMember ? "Update" : "Add"} Member
        </button>
      </div>
    </form>
  );
}
