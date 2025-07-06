import { createSignal, Show } from "solid-js";

export function FamilyTreeHelp() {
  const [showHelp, setShowHelp] = createSignal(false);

  return (
    <>
      <button
        onClick={() => setShowHelp(true)}
        class="absolute bottom-4 right-4 z-10 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
        title="Help"
      >
        ?
      </button>

      <Show when={showHelp()}>
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-neutral-800 p-6 rounded-lg max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold text-white">Family Tree Help</h2>
              <button
                onClick={() => setShowHelp(false)}
                class="text-neutral-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div class="space-y-4 text-neutral-300">
              <div>
                <h3 class="font-semibold text-white mb-2">Getting Started</h3>
                <ul class="list-disc list-inside space-y-1 text-sm">
                  <li>Click "Add Member" to add family members to your tree</li>
                  <li>
                    Fill in the form with name, birth/death dates, and gender
                  </li>
                  <li>Select parents and spouses to create relationships</li>
                </ul>
              </div>

              <div>
                <h3 class="font-semibold text-white mb-2">Navigation</h3>
                <ul class="list-disc list-inside space-y-1 text-sm">
                  <li>Drag family members to reposition them</li>
                  <li>Use mouse wheel to zoom in/out</li>
                  <li>Click "Reset View" to return to default zoom</li>
                  <li>Click "Auto Layout" to automatically arrange members</li>
                </ul>
              </div>

              <div>
                <h3 class="font-semibold text-white mb-2">Managing Members</h3>
                <ul class="list-disc list-inside space-y-1 text-sm">
                  <li>Click on a member to select them</li>
                  <li>Use Edit button to modify member information</li>
                  <li>Use Delete button to remove a member</li>
                  <li>Hover over members to see detailed information</li>
                </ul>
              </div>

              <div>
                <h3 class="font-semibold text-white mb-2">Relationships</h3>
                <ul class="list-disc list-inside space-y-1 text-sm">
                  <li>Blue lines connect parents to children</li>
                  <li>Green dashed lines connect spouses</li>
                  <li>
                    Colors indicate gender: Blue (male), Pink (female), Purple
                    (other)
                  </li>
                </ul>
              </div>

              <div>
                <h3 class="font-semibold text-white mb-2">Import/Export</h3>
                <ul class="list-disc list-inside space-y-1 text-sm">
                  <li>
                    Click "Export" to save your family tree as a JSON file
                  </li>
                  <li>Click "Import" to load a previously saved family tree</li>
                  <li>Your data is automatically saved in your browser</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Show>
    </>
  );
}
