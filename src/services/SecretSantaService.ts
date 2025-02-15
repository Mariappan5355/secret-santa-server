import { IEmployee } from '../models/Employee.js';
import Assignment, { IAssignment } from '../models/Assignment.js';

export class SecretSantaService {
    private async getPreviousAssignments(year: number): Promise<IAssignment[]> {
      return Assignment.find({ year });
    }
  
    private shuffleEmployees(employees: IEmployee[]): IEmployee[] {
      const shuffled = [...employees];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }
  
    private isValidAssignment(
      santa: IEmployee,
      child: IEmployee,
      previousAssignments: IAssignment[]
    ): boolean {
      if (santa.emailId === child.emailId) return false;
      
      const previousAssignment = previousAssignments.find(
        assignment => 
          assignment.employeeEmailId === santa.emailId &&
          assignment.secretChildEmailId === child.emailId
      );
      
      return !previousAssignment;
    }
  
    public async generateAssignments(
      employees: IEmployee[],
      year: number
    ): Promise<IAssignment[]> {
      const previousAssignments = await this.getPreviousAssignments(year - 1);
      const assignments: IAssignment[] = [];
      let attempts = 0;
      const maxAttempts = 10;
  
      while (attempts < maxAttempts) {
        try {
          const shuffledEmployees = this.shuffleEmployees(employees);
          assignments.length = 0;
  
          for (let i = 0; i < employees.length; i++) {
            const santa = employees[i];
            let assigned = false;
  
            for (let j = 0; j < shuffledEmployees.length; j++) {
              const potentialChild = shuffledEmployees[j];
              if (
                this.isValidAssignment(santa, potentialChild, previousAssignments) &&
                !assignments.some(a => a.secretChildEmailId === potentialChild.emailId)
              ) {
                assignments.push(new Assignment({
                                  employeeName: santa.name,
                                  employeeEmailId: santa.emailId,
                                  secretChildName: potentialChild.name,
                                  secretChildEmailId: potentialChild.emailId,
                                  year
                                }));
                assigned = true;
                break;
              }
            }
  
            if (!assigned) throw new Error("Invalid assignment configuration");
          }
  
          return assignments;
        } catch (error) {
          attempts++;
          if (attempts === maxAttempts) {
            throw new Error("Could not generate valid assignments after maximum attempts");
          }
        }
      }
  
      throw new Error("Unexpected error in assignment generation");
    }
  }

  