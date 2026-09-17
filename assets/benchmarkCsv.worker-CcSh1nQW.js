(function(){"use strict";const e=o=>`"${String(o??"").replaceAll('"','""')}"`,t=o=>[["Mode","Runs","Status","Completed","Total","Duration (ms)","Error"].map(e).join(","),...o.map(s=>[s.mode,s.runs,s.status,s.completed,s.total,s.durationMs,s.error].map(e).join(","))].join(`
`);self.onmessage=({data:o})=>{self.postMessage(t(o.runs))}})();
