export default function InstructorSettingsPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <p className="mt-2 text-gray-600">
        Manage your instructor account settings.
      </p>

      <div className="mt-8 max-w-2xl rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">
          Profile Settings
        </h2>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium">
              Name
            </label>

            <input
              type="text"
              placeholder="Your name"
              className="mt-2 w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              placeholder="your@email.com"
              className="mt-2 w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="button"
            className="rounded-lg bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}