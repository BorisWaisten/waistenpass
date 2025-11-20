export type UserRole = 'admin' | 'organizer' | 'attendee';

export interface UserProps {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
}

export class User {
  private constructor(private props: UserProps) {}

  static create(props: UserProps): User {
    return new User({ ...props, email: props.email.toLowerCase() });
  }

  get id(): string {
    return this.props.id;
  }

  get email(): string {
    return this.props.email;
  }

  get role(): UserRole {
    return this.props.role;
  }

  updateEmail(email: string): void {
    this.props.email = email.toLowerCase();
  }

  updatePasswordHash(passwordHash: string): void {
    this.props.passwordHash = passwordHash;
  }

  updateRole(role: UserRole): void {
    this.props.role = role;
  }

  get snapshot(): Omit<UserProps, 'passwordHash'> {
    const { passwordHash, ...rest } = this.props;
    void passwordHash;
    return { ...rest };
  }

  snapshotWithSensitiveData(): UserProps {
    return { ...this.props };
  }
}
