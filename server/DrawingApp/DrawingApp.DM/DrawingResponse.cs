using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DrawingApp.DM
{
    public class DrawingResponse
    {
        [Description("Summary of what the AI is drawing")]
        public string Summary { get; set; } = string.Empty;

        [Description("List of drawing commands for the React canvas")]
        public List<DrawCommand> Commands { get; set; } = new();
    }

    public class DrawCommand
    {
        [Description("The shape type: 'line', 'rect', 'circle', or 'clear'")]
        public string Type { get; set; } = string.Empty;

        public float X { get; set; }
        public float Y { get; set; }

        // שדות אופציונליים בהתאם לסוג הצורה
        public float? ToX { get; set; } // עבור קווים
        public float? ToY { get; set; } // עבור קווים
        public float? Width { get; set; } // עבור מלבנים
        public float? Height { get; set; } // עבור מלבנים
        public float? Radius { get; set; } // עבור עיגולים

        public string Color { get; set; } = "black";
        public float LineWidth { get; set; } = 2;
    }
}
