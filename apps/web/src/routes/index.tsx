import { createFileRoute } from "@tanstack/solid-router";
import { useQuery } from "@tanstack/solid-query";
import { orpc } from "../utils/orpc";
import { Match, Switch } from "solid-js";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const healthCheck = useQuery(() => orpc.healthCheck.queryOptions());
  const session = authClient.useSession();
  const navigate = Route.useNavigate();

  return (
    <div class="min-h-screen bg-neutral-950">
      {/* Hero Section */}
      <div class="relative overflow-hidden bg-gradient-to-br from-neutral-900 to-neutral-950">
        <div class="max-w-7xl mx-auto px-4 py-20">
          <div class="text-center">
            <h1 class="text-5xl md:text-7xl font-bold text-white mb-6">
              Family Tree
              <span class="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                Builder
              </span>
            </h1>
            <p class="text-xl md:text-2xl text-neutral-300 mb-8 max-w-3xl mx-auto">
              Create, manage, and visualize your family history with our
              interactive family tree canvas. Connect generations and preserve
              your family legacy.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              {session().data ? (
                <>
                  <button
                    onClick={() => navigate({ to: "/family-tree" })}
                    class="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-xl transition-colors"
                  >
                    Open Family Tree
                  </button>
                  <button
                    onClick={() => navigate({ to: "/dashboard" })}
                    class="px-8 py-4 bg-neutral-700 hover:bg-neutral-600 text-white text-lg font-semibold rounded-xl transition-colors"
                  >
                    Go to Dashboard
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate({ to: "/login" })}
                    class="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-xl transition-colors"
                  >
                    Get Started
                  </button>
                  <button
                    onClick={() => navigate({ to: "/login" })}
                    class="px-8 py-4 bg-neutral-700 hover:bg-neutral-600 text-white text-lg font-semibold rounded-xl transition-colors"
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div class="max-w-7xl mx-auto px-4 py-20">
        <h2 class="text-3xl md:text-4xl font-bold text-white text-center mb-12">
          Features
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="bg-neutral-800 p-6 rounded-xl border border-neutral-700">
            <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
              <svg
                class="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                ></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-white mb-2">
              Interactive Canvas
            </h3>
            <p class="text-neutral-400">
              Drag and drop family members to create your perfect family tree
              layout.
            </p>
          </div>

          <div class="bg-neutral-800 p-6 rounded-xl border border-neutral-700">
            <div class="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
              <svg
                class="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-white mb-2">Auto Layout</h3>
            <p class="text-neutral-400">
              Automatically organize your family tree with intelligent
              positioning algorithms.
            </p>
          </div>

          <div class="bg-neutral-800 p-6 rounded-xl border border-neutral-700">
            <div class="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
              <svg
                class="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"
                ></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-white mb-2">
              Export & Import
            </h3>
            <p class="text-neutral-400">
              Save your family tree data and share it with family members.
            </p>
          </div>

          <div class="bg-neutral-800 p-6 rounded-xl border border-neutral-700">
            <div class="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
              <svg
                class="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-white mb-2">
              Relationship Tracking
            </h3>
            <p class="text-neutral-400">
              Track parent-child relationships and marriages with visual
              connections.
            </p>
          </div>

          <div class="bg-neutral-800 p-6 rounded-xl border border-neutral-700">
            <div class="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
              <svg
                class="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                ></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-white mb-2">
              Rich Information
            </h3>
            <p class="text-neutral-400">
              Store birth dates, death dates, and other important family
              information.
            </p>
          </div>

          <div class="bg-neutral-800 p-6 rounded-xl border border-neutral-700">
            <div class="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center mb-4">
              <svg
                class="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-white mb-2">Easy Search</h3>
            <p class="text-neutral-400">
              Quickly find family members and navigate through large family
              trees.
            </p>
          </div>
        </div>
      </div>

      {/* Status Section */}
      <div class="max-w-7xl mx-auto px-4 pb-20">
        <div class="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
          <h3 class="text-lg font-semibold text-white mb-4">System Status</h3>
          <Switch>
            <Match when={healthCheck.isPending}>
              <div class="flex items-center gap-2">
                <div class="h-3 w-3 rounded-full bg-gray-500 animate-pulse" />
                <span class="text-neutral-400">Checking connection...</span>
              </div>
            </Match>
            <Match when={healthCheck.isError}>
              <div class="flex items-center gap-2">
                <div class="h-3 w-3 rounded-full bg-red-500" />
                <span class="text-neutral-400">API disconnected</span>
              </div>
            </Match>
            <Match when={healthCheck.isSuccess}>
              <div class="flex items-center gap-2">
                <div
                  class={`h-3 w-3 rounded-full ${healthCheck.data ? "bg-green-500" : "bg-red-500"}`}
                />
                <span class="text-neutral-400">
                  {healthCheck.data ? "API connected" : "API disconnected"}
                </span>
              </div>
            </Match>
          </Switch>
        </div>
      </div>
    </div>
  );
}
