export class Build {
  versionCode: number;
  path: string;
  versionName: string;
  notes: string;
  timestamp: string;
  commit: string;

  constructor(
    versionCode: number,
    path: string,
    versionName: string,
    commit: string,
    timestamp: string,
    notes: string = '',
  ) {
    this.versionCode = versionCode;
    this.path = path;
    this.versionName = versionName;
    this.notes = notes;
    this.timestamp = timestamp;
    this.commit = commit;
  }

  static fromJson(json: any): Build {
    return new Build(
      json.versionCode,
      json.path,
      json.versionName,
      json.commit,
      json.timestamp,
      json.notes || '',
    );
  }

  toJson(): object {
    return {
      versionCode: this.versionCode,
      path: this.path,
      versionName: this.versionName,
      notes: this.notes,
      timestamp: this.timestamp,
      commit: this.commit,
    };
  }
}
