/** No external endpoints are assumed. Replace this provider after receiving documentation. */
export interface LeanFleetProvider {
  status(): Promise<{ provider: string; connected: boolean; message: string }>;
}
export class MockLeanFleetProvider implements LeanFleetProvider {
  async status() { return { provider: 'mock', connected: false, message: 'Integração aguardando documentação da API Lean Fleet.' }; }
}
export const leanFleet: LeanFleetProvider = new MockLeanFleetProvider();
