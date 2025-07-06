import { createFileRoute } from "@tanstack/solid-router";
import { authClient } from "@/lib/auth-client";
import { createEffect, Show } from "solid-js";
import { FamilyTreeCanvas } from "@/components/family-tree-canvas";

export const Route = createFileRoute("/family-tree")({
  component: RouteComponent,
});

function RouteComponent() {
  const session = authClient.useSession();
  const navigate = Route.useNavigate();

//   createEffect(() => {
//     if (!session().data && !session().isPending) {
//       navigate({
//         to: "/login",
//       });
//     }
//   });

  return (
    <div class="min-h-screen bg-neutral-950">
      <Show when={session().isPending}>
        <div class="flex items-center justify-center h-screen">
          <div class="text-neutral-100">Loading...</div>
        </div>
      </Show>

        <div class="flex flex-col h-screen">
          <header class="bg-neutral-900 border-b border-neutral-800 p-4">
            <div class="flex items-center justify-between">
              <h1 class="text-2xl font-bold text-neutral-100">Family Tree</h1>
              <div class="flex items-center gap-4">
                <span class="text-neutral-300">
                  Welcome, {session().data?.user.name}
                </span>
                <button
                  onClick={() => navigate({ to: "/dashboard" })}
                  class="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-neutral-100 rounded-lg transition-colors"
                >
                  Dashboard
                </button>
              </div>
            </div>
          </header>

          <div class="flex-1 overflow-hidden">
            <FamilyTreeCanvas />
          </div>
        </div>
    </div>
  );
}
