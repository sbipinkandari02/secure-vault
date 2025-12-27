export default function SecretList({ secrets, onDelete }) {
  if (!secrets.length) {
    return <p>No secrets stored</p>;
  }

  return (
    <div>
      <h3>Stored Secrets</h3>

      {secrets.map((secret, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "8px",
          }}
        >
          <p><strong>Name:</strong> {secret.name}</p>
          <p><strong>Username:</strong> {secret.username}</p>
          <p><strong>Password:</strong> {secret.password}</p>

          {secret.notes && (
            <p><strong>Notes:</strong> {secret.notes}</p>
          )}

          <button onClick={() => onDelete(index)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
