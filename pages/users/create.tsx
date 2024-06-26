import Register from "@/components/shared/register/register";

export default function Create() {
  return (
    <div className="flex flex-col space-y-8 w-full max-w-md mx-auto mt-32">
      <div className="flex flex-col space-y-2 text-center">
        <h2 className="text-2xl font-bold text-gray-600">Create User</h2>
        <p className="text-gray-500 text-sm font-normal">
          Create a new user account. You can choose the role of the user.
        </p>
      </div>

      <Register roles={["Teacher", "Admin"]} />
    </div>
  );
}
