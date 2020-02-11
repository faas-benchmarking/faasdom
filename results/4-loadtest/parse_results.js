const fs = require('fs');

const CLOUDS = ['aws', 'azure', 'azure_win', 'google', 'ibm'];
const RUNTIMES = ['node', 'python', 'go', 'dotnet'];
const RPS = ['10', '25', '50', '100', '200', '400', '800', '1000'];

let result = 'provider,runtime,rps,rps_achieved,number_of_requests,errors,http_errors,rps_corrected,avg,min,max,stdv,50%,95%,99%\n';

for(let cloud = 0; cloud<CLOUDS.length; cloud++) {

    if (fs.existsSync('./' + CLOUDS[cloud] + '_results/')) {
        
        for(let runtime = 0; runtime<RUNTIMES.length; runtime++) {

            for(let rps = 0; rps<RPS.length; rps++) {

                if (fs.existsSync('./' + CLOUDS[cloud] + '_results/' + CLOUDS[cloud] + '_' + RUNTIMES[runtime] + '_' + RPS[rps] + '.txt')) {

                    let latency_avg = 0;
                    let latency_stdev = 0;
                    let latency_max = 0;
                    let latency_min = 0;
                    let rps_achieved = 0;
                    let percentile_50 = 0;
                    let percentile_95 = 0;
                    let percentile_99 = 0;
                    let errors = 0;
                    let http_errors = 0;
                    let rps_corrected = 0;
                    let number_of_requests = 0;

                    let file = fs.readFileSync('./' + CLOUDS[cloud] + '_results/' + CLOUDS[cloud] + '_' + RUNTIMES[runtime] + '_' + RPS[rps] + '.txt', 'utf8');

                    let lines = file.split('\n');
                    for(let j=0; j<lines.length; j++) {

                        if(lines[j].startsWith('#[Mean')) {
                            let cleanLine = lines[j].replace(/ /g, '');
                            let parts = cleanLine.split(',');
                            latency_avg = parts[0].substring(parts[0].indexOf("=") + 1);
                            latency_stdev = parts[1].substring(parts[1].indexOf("=") + 1).replace(']','');

                        } else if(lines[j].startsWith('#[Max')) {
                            let cleanLine = lines[j].replace(/ /g, '');
                            let parts = cleanLine.split(',');
                            latency_max = parts[0].substring(parts[0].indexOf("=") + 1);

                        } else if(lines[j].startsWith('Requests/sec:')) {
                            let cleanLine = lines[j].replace(/ /g, '');
                            rps_achieved = cleanLine.substring(cleanLine.indexOf(":") + 1);

                        } else if(lines[j].startsWith('  Socket errors:')) {
                            let cleanLine = lines[j].replace(/ /g, '');
                            cleanLine = cleanLine.substring(cleanLine.indexOf(":") + 1);
                            let parts = cleanLine.split(',');
                            for(let k=0; k<parts.length; k++) {
                                errors += Number(parts[k].replace(/([^0-9])/g,''));
                            }

                        } else if(lines[j].startsWith(' 50.000%')) {
                            let cleanLine = lines[j].replace(/ /g, '');
                            if(cleanLine.includes('ms')) {
                                cleanLine = cleanLine.replace(/([a-z])/g,'');
                                percentile_50 = cleanLine.substring(cleanLine.indexOf("%") + 1);
                            } else {
                                cleanLine = cleanLine.replace(/([a-z])/g,'');
                                percentile_50 = cleanLine.substring(cleanLine.indexOf("%") + 1) * 1000;
                            }

                        } else if(lines[j].startsWith(' 99.000%')) {
                            let cleanLine = lines[j].replace(/ /g, '');
                            if(cleanLine.includes('ms')) {
                                cleanLine = cleanLine.replace(/([a-z])/g,'');
                                percentile_99 = cleanLine.substring(cleanLine.indexOf("%") + 1);
                            } else {
                                cleanLine = cleanLine.replace(/([a-z])/g,'');
                                percentile_99 = cleanLine.substring(cleanLine.indexOf("%") + 1) * 1000;
                            }

                        } else if(lines[j].includes('0.950000')) {
                            let cleanLine = lines[j].replace(/  +/g, ' ');
                            let parts = cleanLine.split(' ');
                            percentile_95 = Math.round(parts[1] * 100) / 100;

                        } else if(lines[j].includes('requests in')) {
                            let cleanLine = lines[j].replace(/  +/g, ' ');
                            let parts = cleanLine.split(' ');
                            number_of_requests = parts[1];

                        } else if(lines[j].includes('Non-2xx or 3xx responses:')) {
                            let cleanLine = lines[j].replace(/  +/g, ' ');
                            let parts = cleanLine.split(' ');
                            http_errors = parts[5];

                        } else if(j==20) {
                            let cleanLine = lines[j].replace(/  +/g, ' ');
                            let parts = cleanLine.split(' ');
                            latency_min = parts[1];
                        }

                        
                    }

                    rps_corrected = (number_of_requests - http_errors) / 60;

                    result +=   CLOUDS[cloud] + ',' + 
                                RUNTIMES[runtime] + ',' +
                                RPS[rps] + ',' +
                                rps_achieved + ',' +
                                number_of_requests + ',' +
                                errors + ',' +
                                http_errors + ',' +
                                rps_corrected + ',' +
                                latency_avg + ',' +
                                latency_min + ',' +
                                latency_max + ',' +
                                latency_stdev + ',' +
                                percentile_50 + ',' +
                                percentile_95 + ',' +
                                percentile_99 + '\n';
                }

            }

        }

    }

}

fs.writeFileSync('./raw_parsed_wrk2.csv', result);