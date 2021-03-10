import React from "react";
import "./InfoBox.css";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

function InfoBox({ title, cases, total }) {
   return (
      <Card className="infoBox">
         <CardContent>
            {/* Title */}
            <Typography className="infoBox_title" color="textSecondary">
               {title}
            </Typography>
            {/* Number of Cases */}
            <h2 className="infoBox_cases">{cases}</h2>
            {/* Total */}
            <Typography className="infoBox_total" color="textSecondary">
               {total} Total
            </Typography>
         </CardContent>
      </Card>
   );
}

export default InfoBox;
