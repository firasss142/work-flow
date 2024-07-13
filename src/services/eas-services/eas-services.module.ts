import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { IEASService } from "src/core";
import { EASService } from "src/frameworks/eas/eas-services.service";

@Module({
  imports: [HttpModule], // Add HttpModule to the imports array
  providers: [
    {
      provide: IEASService, // Use the abstract class or interface as a token
      useClass: EASService, // Provide the concrete implementation
    },
  ],
  exports: [IEASService], // Export the abstract class or interface
})
export class EASModule {}
