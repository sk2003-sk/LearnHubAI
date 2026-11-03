import RegisterForm from "../components/RegisterForm";

function Register() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-secondary">
          Get started
        </p>
        <h2 className="text-3xl font-bold text-foreground">
          Create your account
        </h2>
        <p className="text-foreground-secondary">
          Join LearnHub and start building new skills.
        </p>
      </div>

      <RegisterForm />
    </div>
  );
}

export default Register;
