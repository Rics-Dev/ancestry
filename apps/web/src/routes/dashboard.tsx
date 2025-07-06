import { authClient } from "@/lib/auth-client";
import { orpc } from "@/utils/orpc";
import { useQuery } from "@tanstack/solid-query";
import { createFileRoute } from "@tanstack/solid-router";
import { createEffect, Show } from "solid-js";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const session = authClient.useSession();
  const navigate = Route.useNavigate();

  const privateData = useQuery(() => orpc.privateData.queryOptions());

  createEffect(() => {
    if (!session().data && !session().isPending) {
      navigate({
        to: "/login",
      });
    }
  });

  return (
    <div>
      <Show when={session().isPending}>
        <div>Loading...</div>
      </Show>

      <Show when={!session().isPending && session().data}>
        <div class="min-h-screen bg-neutral-950 p-8">
          <div class="max-w-4xl mx-auto">
            <h1 class="text-3xl font-bold text-neutral-100 mb-8">Dashboard</h1>
            <p class="text-lg text-neutral-300 mb-8">
              Welcome back, {session().data?.user.name}!
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Family Tree Card */}
              <div class="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
                <h2 class="text-xl font-semibold text-white mb-3">
                  Family Tree
                </h2>
                <p class="text-neutral-400 mb-4">
                  Create and manage your family tree with an interactive canvas
                </p>
                <button
                  onClick={() => navigate({ to: "/family-tree" })}
                  class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Open Family Tree
                </button>
              </div>

              {/* Quick Stats */}
              <div class="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
                <h2 class="text-xl font-semibold text-white mb-3">
                  Quick Stats
                </h2>
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-neutral-400">Family Members:</span>
                    <span class="text-white">-</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-neutral-400">Generations:</span>
                    <span class="text-white">-</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-neutral-400">Relationships:</span>
                    <span class="text-white">-</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div class="bg-neutral-800 rounded-lg p-6 border border-neutral-700">
                <h2 class="text-xl font-semibold text-white mb-3">
                  Getting Started
                </h2>
                <ul class="space-y-2 text-sm text-neutral-400">
                  <li>• Add your first family member</li>
                  <li>• Create relationships between family members</li>
                  <li>• Use auto-layout to organize your tree</li>
                  <li>• Export your family tree data</li>
                </ul>
              </div>
            </div>

            <div class="mt-8 p-4 bg-neutral-800 rounded-lg border border-neutral-700">
              <p class="text-neutral-300">
                API Data: {privateData.data?.message}
              </p>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
}
