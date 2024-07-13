// src/circle/circle.module.ts

import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios"; // Import HttpModule
import { ICircleService } from "src/core";
import { CircleService } from "src/frameworks/circleSdk/circle-services.service";

@Module({
  imports: [HttpModule], // Add HttpModule to the imports array
  providers: [
    {
      provide: ICircleService, // Use the abstract class or interface as a token
      useClass: CircleService, // Provide the concrete implementation
    },
  ],
  exports: [ICircleService], // Export the abstract class or interface
})
export class CircleModule {}
