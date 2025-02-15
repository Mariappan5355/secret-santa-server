import { Request, Response } from 'express';
import { SecretSantaService } from '../services/SecretSantaService.js';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import Assignment from '../models/Assignment.js';
import { Parser } from 'json2csv';
import { fileURLToPath } from 'url';


export class SecretSantaController {
  private service: SecretSantaService;

  constructor() {
    this.service = new SecretSantaService();
  }

  public async handleFileUpload(req: Request, res: Response): Promise<void> {
    try {
      const currentFile = (req.files as { [currentYear: string]: Express.Multer.File[] })?.['currentYear']?.[0];
      const previousFile = (req.files as { [previousYear: string]: Express.Multer.File[] })?.['previousYear']?.[0];

      if (!currentFile) {
        res.status(400).json({ error: 'Current year file is required' });
        return;
      }

      const employees = this.parseExcel(currentFile);
      const currentYear = new Date().getFullYear();

      if (previousFile) {
        const previousAssignments = this.parseExcel(previousFile, true);
        await Assignment.deleteMany({ year: currentYear - 1 });
        await Assignment.insertMany(
            previousAssignments.map(assignment => ({
                employeeName: assignment.name,
                employeeEmailId: assignment.emailId, 
                secretChildName: assignment.secretChildName,
                secretChildEmailId: assignment.secretChildEmailId,
                year: currentYear - 1
            }))
        );
      }

      const assignments = await this.service.generateAssignments(employees, currentYear);
      await Assignment.insertMany(assignments);

      const csvFilePath = this.generateCSV(assignments);

      res.download(csvFilePath, 'SecretSantaAssignments.csv', (err) => {
        if (err) {
          console.error('Error downloading CSV file:', err);
          res.status(500).json({ error: 'Failed to generate CSV file' });
        }
        fs.unlinkSync(csvFilePath);
      });
    } catch (error) {
      console.error('Error processing files:', error);
      res.status(500).json({ error: 'Failed to process files' });
    }
  }

  private parseExcel(file: Express.Multer.File, isPreviousYear: boolean = false): any[] {
    try {
        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);

        return data.map((row: any) => {
            const parsedData: any = {
                name: row.Employee_Name || row.employeeName,
                emailId: row.Employee_EmailID || row.employeeEmailId
            };

            if (isPreviousYear) {
                parsedData.secretChildName = row.Secret_Child_Name || row.secretChildName;
                parsedData.secretChildEmailId = row.Secret_Child_EmailID || row.secretChildEmailId;
            }

            return parsedData;
        });
    } catch (error) {
        console.error('Error parsing Excel file:', error);
        throw new Error('Invalid Excel file format');
    }
}


  private generateCSV(assignments: any[]): string {
    const fields = ['Employee_Name', 'Employee_EmailID', 'Secret_Child_Name', 'Secret_Child_EmailID'];
    const parser = new Parser({ fields });
    const csv = parser.parse(assignments.map(a => ({
      Employee_Name: a.employeeName,
      Employee_EmailID: a.employeeEmailId,
      Secret_Child_Name: a.secretChildName,
      Secret_Child_EmailID: a.secretChildEmailId
    })));
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const filePath = path.join(__dirname, '../../output/SecretSantaAssignments.csv');
    fs.writeFileSync(filePath, csv);
    return filePath;
  }
}
