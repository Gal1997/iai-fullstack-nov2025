/* eslint-disable @typescript-eslint/no-explicit-any */

import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    TextField,
    Switch
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Controller, type Control, type RegisterOptions } from "react-hook-form";

import type { ConfigType } from '../types/config';

/* Here we configure what props each input field should send to the factory function
 It sends:
    - path: The full form path (e.g., "build.outputDirectory")
    - label: The field label shown in the UI (e.g., "Build Command")
    - control: The react-hook-form Control<ConfigType> instance

  Optional:
    - rules: Validation rules (we use 'required' and URL validation)
    - disabled: Used for VDD, if user doesn't want vdd then VDD input will be disabled

 */
type ControlledFieldProps = {
    path: string;
    label: string;
    control: Control<ConfigType>;
    rules?: RegisterOptions;
    disabled?: boolean;
};


/* Here we configure the props this component takes, which is the react-hook-form control and also
   if user enabled VDD or not + callback function to change this value*/
type ConfigAccordionProps = {
    control: Control<ConfigType>;
    VDDenabled: boolean;
    setVDDenabled: (value: boolean) => void;
};


/* In order for react-hook-form to work with MUI TextField, we wrap each TextField with a controller
   that we got from react-hook-form. This syncs the form state without manually writing onChange handlers
   and also registers each field and tracks its value.

   In practice : the controller gives us 'field' which already contains value/onChange in it,
   and we pass it directly into TextField so react-hook-form now controls it.

   To minimize code, we create a 'factory' function that can return all that, we just need
   to give it path + label. For example: 'build.command' + 'Build Command'
   and it will return a MUI TextField wrapped inside a react-hook-form Controller
*/
const ControlledField = ({ path, label, control, rules, disabled = false }: ControlledFieldProps) => (
    <Controller
        name={path as any}
        control={control}
        rules={rules as any}
        render={({ field, fieldState }) => (
            <TextField
                {...field} // This is like doing onChange={field.onChange} and many more, spreading field saves us lines of code
                label={label}
                disabled={disabled}
                sx={{ m: 1 }}
                error={!disabled && !!fieldState.error} // If its undefined, meaning theres no error, else this resolves to 'true' and that causes the red border on input and red font for error
                helperText={!disabled && (fieldState.error?.message ?? null)} // If there's an error, show it (below input), else show nothing
            />
        )}
    />
);



const ConfigAccordion = ({ control, VDDenabled, setVDDenabled }: ConfigAccordionProps) => {
    return (
        <div>
            {/* Each Accordion has a title (Accordion Summary), and input fields (Accordion Details)
            Each input field has its own validation rules that will trigger when we run handleSubmit (that comes from react-hook-form also)
            Every input is simply 'required' except URL which we also check if its in URL format*/}
            <Accordion defaultExpanded >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Connection Details</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {/* URL */}
                    <ControlledField
                        path="configurationManager.url"
                        label="URL"
                        control={control}
                        rules={{
                            required: "URL is required",
                            validate: (v: string) => {
                                try {
                                    new URL(v);
                                    return true;
                                } catch {
                                    return "Please include protocol (https://...)";
                                }
                            },
                        }}
                    />
                    {/* Username */}
                    <ControlledField
                        path="configurationManager.username"
                        label="Username"
                        control={control}
                        rules={{ required: "Username is required" }}
                    />
                    {/* Password */}
                    <ControlledField
                        path="configurationManager.password"
                        label="Password"
                        control={control}
                        rules={{ required: "Password is required" }}
                    />
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Branch Selection</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {/* Default Branch */}
                    <ControlledField
                        path="branchSelection.defaultBranch"
                        label="Default Branch"
                        control={control}
                        rules={{ required: "Default branch is required" }}
                    />
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Build</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {/* Build command */}
                    <ControlledField
                        path="build.command"
                        label="Build command"
                        control={control}
                        rules={{ required: "Build command is required" }}
                    />
                    {/* Output directory */}
                    <ControlledField
                        path="build.outputDirectory"
                        label="Output directory"
                        control={control}
                        rules={{ required: "Output directory is required" }}
                    />
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Copy to Target Directory</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {/* Target directory */}
                    <ControlledField
                        path="copyToTarget.targetDirectory"
                        label="Target directory"
                        control={control}
                        rules={{ required: "Target directory is required" }}
                    />
                </AccordionDetails>
            </Accordion>


            {/* VDD Section*/}
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Version Description Document (VDD)</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div className="enable_vdd_container">
                        <span>Enable VDD</span>
                        <Switch
                            checked={VDDenabled}
                            onChange={(e) => (setVDDenabled(e.target.checked))}
                        />
                    </div>

                    {/* Version number */}
                    <ControlledField
                        path="vdd.versionNumber"
                        label="Version number"
                        control={control}
                        disabled={!VDDenabled}
                        rules={{ required: VDDenabled ? 'Version number is required' : false }}
                    />

                    {/* Release date */}
                    <Controller
                        name={"vdd.releaseDate" as any}
                        control={control}
                        rules={{
                            required: VDDenabled ? 'Release date is required' : false,
                            validate: (v: string | undefined) => {
                                if (!VDDenabled) return true; // skip validation if VDD disabled
                                if (!v || v.includes("undefined")) return "Release date is required"; // fail if empty or contains 'undefined'
                                return true; // valid otherwise
                            },
                        }}

                        render={({ field, fieldState }) => (
                            <TextField
                                {...field}
                                label="Release Date"
                                type="date"
                                sx={{ m: 1 }}
                                value={field.value || ""}
                                disabled={!VDDenabled}
                                error={VDDenabled && !!fieldState.error}
                                helperText={VDDenabled && (fieldState.error?.message ?? null)}
                                slotProps={{
                                    inputLabel: { shrink: true },// forces label to stay up so it doesnt clash with 'dd-----yyyy' placeholder
                                    htmlInput: {
                                        max: new Date().toISOString().split('T')[0], // this makes sure maximum date is today (no future dates)
                                    },
                                }}
                            />
                        )}
                    />

                    {/* Recent fixes - multiline textarea */}
                    <Controller
                        name={"vdd.recentFixes" as any}
                        control={control}
                        disabled={!VDDenabled}
                        rules={{ required: VDDenabled ? 'Recent fixes is required' : false }}
                        render={({ field, fieldState }) => (
                            <TextField
                                {...field}
                                label="Recent fixes (comma seperated)"
                                placeholder="Ex. 'fixed login, fixed homepage'"
                                sx={{ m: 1, width: "100%" }} // width 100% so it will be on its own line
                                multiline
                                minRows={3}
                                error={VDDenabled && !!fieldState.error}
                                helperText={VDDenabled && (fieldState.error?.message ?? null)}
                            />
                        )}
                    />
                </AccordionDetails>
            </Accordion>
        </div>
    );
};

export default ConfigAccordion;
