Operating
Instructions
Fronius Datamanager
Modbus TCP & RTU
DE Bedienungsanleitung
EN-US Operating instructions
42,0410,2049 031-14062024
Table of contents
The Modbus Protocol 53
General 53
Structure of Modbus Messages 53
Modbus TCP – MBAP Header 54
Supported function codes 54
03 (0x03) Read Holding Registers 55
06 (0x06) Write Single Register 55
16 (0x10) Write Multiple Registers 56
Exception Codes 56
CRC Calculation for Modbus RTU 57
Calculating CRC Checksum 58
Adding CRC Checksum to the Message 59
General 60
Abbreviations Used 60
Communication with the Modbus Master 60
Maps Register 61
Communication with the Modbus Master 62
Response Times 62
Modbus Device ID for Inverters 63
Modbus Device ID for Fronius String Controls 63
Modbus Device ID for Energy Meters 64
Modbus device ID for Fronius Sensor Cards 64
Event Flags 64
Register addresses 65
Unavailable data records 68
Time Response of the Supported Operating Modes 68
Sign Convention for the Power Factor 69
Values Saved on the Card 70
Scale Factors 70
Non-writable registers 71
Entering Invalid Values 71
Modbus Settings 72
General 72
Opening the Modbus Settings 72
Open the Modbus settings 73
Data Output via Modbus 73
Limiting control 76
Save or Reject Changes 76
Fronius Registers 77
Fronius Register 77
Inverter Status Code 77
Deleting Event Flags and Status Codes 77
Saving and Deleting Data 77
Changing the Data Type 77
System Totals 78
Common & Inverter Model 79
Common Block Register 79
Inverter Model Register 79
SunSpec Operating Codes 79
Fronius Operating Codes 79
Nameplate Model (120) 81
General 81
Nameplate Register 81
Basic Settings Model (121) 82
Basic Settings Register 82
Reference Voltage 82
Deviation from Reference Voltage 82
Extended Measurements & Status Model (122) 83
General 83
Extended Measurements & Status Register 83
Englisch (US) 51
Immediate Control Model (123) 84
General 84
Immediate Controls Register 84
Standby 84
Power reduction 84
Example: Setting a Power Reduction 85
Example: Changing the Return Time When Power Reduction Has Been Activated 85
Effects of Reactive Power Specifications on Effective Power 86
Constant Power Factor 87
Example: Setting a Constant Power Factor 87
Constant Relative Reactive Power 88
Example: Setting Constant Reactive Power 88
Multiple MPPT Inverter Extension Model (160) 89
General 89
Multiple MPPT Inverter Extension Register 89
Basic Storage Control Model (124) 91
General 91
Information Provided 91
Power Window Specifications 91
Setting the Minimum Charge Level 93
Charging the energy storage via the grid 93
Basic Storage Controls Register 93
Register manipulation and Battery status changes in Fronius Solar.web 93
String Combiner Model (403) 95
String Combiner Register 95
Meter Model 96
Meter Model Register 96
End Block 97
General 97
End Block 97
String Combiner Event Flags 98
String Combiner Event Flags 98
52
The Modbus Protocol
General The description of the protocol is largely taken from the Modbus specifications,
which are publicly available at www.modbus.org/specs.php.
Modbus is a simple, open communication protocol, with which master-slave or
client-server communication can be carried out between the devices connected
to the network. The basic principle of Modbus is: A master sends a request and a
slave responds to this. In Modbus TCP, the master is referred to as the client and
a slave as a server. The function is the same. The descriptions of the protocol
functions provided below will use the more common names master and slave, ir-
respective of the RTU and TCP variants. In cases where there are differences
between RTU and TCP, this will be specifically indicated.
Modbus can be used in two ways on the Fronius Datamanager:

- Modbus TCP
  using TCP/IP via Ethernet (connected by cable or via WLAN)
- Modbus RTU
  using asynchronous serial transmission via RS-485 (EIA/TIA-485-A), only for
  Fronius Datamanager 2.0.
  In the case of Modbus RTU, there can only ever be one master in the system. In
  principle, only one master may initiate requests. A slave may only give a response
  if it has been addressed by the master; the slaves cannot communicate with each
  other. If a broadcast request (request to all available slaves via slave ID or unit
  ID 0) is sent, none of the slaves can respond. Broadcasts can therefore only be
  used for write commands.
  If a master sends a request to a slave, then it expects a response. In the event of
  a request from a master, there are five options:
- If the slave receives the request without communication errors and can pro-
  cess this request without errors, then a normal response will be sent with the
  required data.
- If the slave does not receive the request due to a communication error, then
  no response is sent. This leads to a timeout on the master.
- If the slave receives the request, but discovers a communication error (pari-
  ty, CRC, etc.), then no response is sent. This leads to a timeout on the master.
- If the slave receives the request without communication errors, but cannot
  process it without errors (e.g., if a register that is not available needs to be
  read), then an error message (exception response) is returned with the rea-
  son for the error.
- If the slave receives a broadcast request, which also goes to all other de-
  vices, then no response will be sent either in the event of an error or if the
  request has been successfully processed. Broadcast requests are therefore
  only suitable for write commands.
  Modbus devices provide data in 16 bit large data blocks (registers).
  In certain cases, individual data points may also cover several data blocks (e.g.,
  2 registers = 32 bit value).
  Structure of
  Modbus
  Messages
  In principle, a Modbus message is made up of the protocol data unit (PDU). This
  is independent of the underlying communication layers.
  Depending on the bus or network that is used, additional fields can also be ad-
  ded. This structure is then referred to as the application data unit (ADU).
  Englisch (US) 53
  Modbus TCP –
  MBAP Header
  Supported func-
  tion codes
  54
  ADU
  Address field Function code Data CRC
  PDU
  Structure of a Modbus message for Modbus RTU
  ADU
  MBAP header Function code Data
  PDU
  Structure of a Modbus message for Modbus TCP
  Modbus TCP uses its own header to identify the application data unit. This hea-
  der is called MBAP header (MODBUS application protocol header).
  The size of the protocol data unit (PDU) is limited due to the first Modbus imple-
  mentations in a serial network (max. RS-485 ADU = 256 bytes). This results in
  the following for the size of the protocol data unit PDU: PDU = 256 – slave ID
  (1 byte) – CRC (2 bytes) = 253 bytes
  This results in:
- Modbus RTU ADU = 253 + slave ID (1 byte) + CRC (2 bytes) = 256 bytes
- Modbus TCP ADU = 253 bytes + MBAP (7 bytes) = 260 bytes
  The MBAP header includes 7 bytes:
- Transaction ID (2 bytes): Is used in order to synchronize request and respon-
  se. The slave adopts the transaction ID from the request into the response.
- Protocol ID (2 bytes): Is always 0 (Modbus protocol).
- Length (2 bytes): The length field includes the number of bytes of the subse-
  quent fields, including unit ID and data fields.
- Unit ID (1 byte): This field is used for addressing devices connected to the
  Fronius Datamanager (gateway function of the Fronius Datamanager). The
  unit ID corresponds to the slave ID in Modbus RTU. The value is specified by
  the master and is returned unchanged by the slave with the response.
  For details about the addressing of the devices, see:
- Modbus Device ID for Inverters on page 63
- Modbus Device ID for Fronius String Controls on page 63
- Modbus Device ID for Energy Meters on page 64
  IMPORTANT: The correct unit ID must always be specified, even if the Froni-
  us Datamanager is only connected to one individual inverter.
  The function code determines the action to be carried out on the slave. Three
  function codes for read and write operations are supported:
- 03 (0x03) 1) read holding registers
- 06 (0x06) 1) write single register
- 16 (0x10) 1) write multiple registers
  If an error occurs on the slave during the processing of a request, an error mes-
  sage is sent as the response (exception response). In the event of this kind of re-
  sponse, the most significant bit of the function code is set to 1 (corresponds to
  adding 0x80 to the function code) 1) and an exception code is added, which indi-
  cates the reason for the error.

1. The prefix "0x" stands for hexadecimal numbers.
   03 (0x03) Read
   Holding Regis-
   ters
   This function code is used to read the content of one or more successive regis-
   ters of a device. The request contains the address of the first register to be read
   and the number of registers to be read. Registers are addressed in the request
   starting at 0. This means that registers 1 to 16 will be addressed via addresses 0
   to 15.
   Request
   Function code 1 byte 0x03
   Start address 2 bytes 0x0000 to 0xFFFF (0 to 65535)
   Number of registers 2 bytes 1 to 125
   Response
   Function code 1 byte 0x03
   Number of bytes 1 byte 2 x N*
   Register values N* x 2 bytes
   _N = number of registers
   Error
   Error code 1 byte 0x83
   Exception code 1 byte 01 or 02 or 03 or 04 or 11
   06 (0x06) Write
   Single Register
   This function code is used in order to write a single register. The request only
   contains the address of the register to be written. Registers are addressed star-
   ting at 0. This means that register 1 is addressed via address 0. The normal re-
   sponse is a copy of the request, which is sent after successfully writing the regis-
   ter.
   Request
   Register value Function code 1 byte 0x06
   Register address 2 bytes 0x0000 to 0xFFFF (0 to 65535)
   2 bytes
   Response
   Function code 1 byte 0x06
   Register address 2 bytes 0x0000 to 0xFFFF (0 to 65535)
   Register value 2 bytes
   Error
   Error code 1 byte 0x86
   Exception code 1 byte 01 or 02 or 03 or 04 or 11
   Englisch (US) 55
   16 (0x10) Write
   Multiple Regis-
   ters
   Exception Codes 56
   Function code 1 byte 0x10
   Start address 2 bytes 0x0000 to 0xFFFF (0 to 65535)
   Number of registers 2 bytes 1 to 123
   Number of bytes 1 byte 2 x N_
   Register values N* x 2 bytes
   This function code is used in order to write a block of successive registers. The
   request contains the address of the first register to be written, the number of re-
   gisters to be written, the number of bytes to be written, and the values to be writ-
   ten (2 bytes per register). The normal response contains the function code, the
   start address, and the number of registers written.
   Request
   *N = number of registers
   Response
   Error
   Function code 1 byte 0x10
   Start address 2 bytes 0x0000 to 0xFFFF (0 to 65535)
   Number of registers 2 bytes 1 to 123
   Error code Exception code 1 byte 1 byte 0x90
   01 or 02 or 03 or 04 or 11
   An error message (exception response) has two fields, which distinguishes it from
   a normal response:

- Function code field
  In a normal response, the function code of the request is adopted into the
  function code field of the response. In all function codes, the most signifi-
  cant bit (MSB) is 0 (the values of the function codes are all lower than 0x80).
  In an error message, the MSB is set to 1. This means that 0x80 is added to
  the value for the function code. The master can identify the response as an
  error message due to the set MSB.
- Data field
  A normal response contains data or statistical values in the data field. In an
  error message, an exception code is returned in the data field. This exception
  code indicates the reason for the error message.
  Modbus Exception Codes
  Code Name Meaning
  01 ILLEGAL FUNCTION The function code in the request is not
  supported by the slave.
  02 ILLEGAL DATA AD-
  DRESS
  Invalid register addresses have been re-
  quested.
  Modbus Exception Codes
  Code Name Meaning
  03 ILLEGAL DATA VALUE A value in the request is outside of the va-
  lid range. This applies both for the fields of
  a request (e.g., invalid number of registers)
  and for invalid setting values for the Sun-
  Spec inverter control models.
  04 SLAVE DEVICE FAILU-
  RE
  An error occurred during an attempt to
  write one or more registers.
  11 GATEWAY TARGET DE-
  VICE FAILED TO RE-
  SPOND
  Only for Modbus TCP.
  The addressed device cannot be found:
  a) the device is not in the SolarNet Ring
  or
  b) the device is switched off
  or
  c) the SolarNet Ring is open.
  CRC Calculation
  for Modbus RTU
  Each Modbus RTU message is equipped with a checksum (CRC, Cyclic Redun-
  dancy Check) in order to be able to identify transmission errors. The size of the
  checksum is 2 bytes. It is calculated by the sending device and attached to the
  message to be sent. For its part, the receiver calculates the checksum from all
  bytes of the received message (without CRC) and compares this with the recei-
  ved checksum. If these two checksums are different, then an error has occurred.
  The calculation of the checksum starts with setting all bits of a 16 bit register
  (CRC register) to 1 (0xFFFF). All bytes of the message are then individually pro-
  cessed with the CRC register. Only the data bytes of one message are used for
  the calculation. Start, stop, and parity bits are not considered.
  During the calculation of the CRC, each byte is XOR-linked with the CRC regis-
  ter. The result is then moved in the direction of the least significant bit (LSB) and
  the most significant bit (MSB) is set to 0. The LSB is considered. If the LSB was
  previously 1, then the CRC register is XOR-linked with a fixed assigned value. If
  the LSB was 0, then nothing needs to be done.
  This process is repeated until the CRC register has been moved eight times. Af-
  ter the last (eighth) movement, the next byte is taken and XOR-linked to the cur-
  rent CRC register. The write process then starts from the beginning; it is again
  moved eight times. After dealing with all bytes of the message, the value of the
  CRC register is the checksum.
  Englisch (US) 57
  Calculation algorithm of the CRC16
  Calculating CRC
  Checksum
  1 Initialize a 16 bit register (2 bytes) with 0xFFFF. This register is referred to as
  the CRC16 register.
  2 XOR-link the first byte of the message with the less significant byte of the
  CRC16 register. The result is saved in the CRC16 register.
  3 Move the CRC16 register 1 bit to the right (in the direction of the LSB), fill
  MSB with 0. Look at LSB.
  4 Check LSB value
- If the LSB was 0: Go to step 3 (move again).
- If the LSB was 1: XOR-link the CRC16 register with the CRC polynomial
  0xA001 (1010 0000 0000 0001).
  5 Repeat steps 3 and 4 until eight movement operations have been carried out.
  When these have been carried out, a complete byte of the message will have
  been processed.
  6 Repeat steps 3 to 5 for the next byte of the message. Repeat everything until
  all bytes of the message have been processed.
  7 After the last byte, the CRC16 register contains the checksum.
  8 When the checksum is added to the message to be sent, then the two byes
  must be inverted as described below.
  58
  Adding CRC
  Checksum to the
  Message
  If the 16 bit (2 bytes) CRC checksum is sent with a message, then the less signifi-
  cant byte is transferred before the more significant one.
  For example, if the CRC checksum is 0x1241 (0001 0010 0100 0001):
  Addr Func Data
  Count
  Data Data Data Data CRC
  Lo
  CRC
  Hi
  0x41 0x12
  Englisch (US) 59
  General
  Abbreviations
  Used
  Communication
  with the Modbus
  Master
  60
  AC Alternating current V Voltage (volts)
  DC Direct current VA Apparent power
  FW Firmware VAr Reactive power
  PF Power factor (cos j) VMax Maximum voltage
  PV Photovoltaics VMin Minimum voltage
  RTC Real-time clock VRef Reference voltage
  SF Scale factor W Power (watts)
  SW Software IN Inverter
  The Fronius Datamanager communicates with the Modbus master using register
  addresses in accordance with the SunSpec Alliance specifications.
  (http://www.sunspec.org/)
  NOTE!
  The Fronius Datamanager also supports the integration of Fronius String Con-
  trols via Fronius Solar Net.
  Fronius String Controls are displayed by an integrated Common Block and the
  subsequent String Combiner Model.
  In addition, the Fronius Datamanager offers the option of providing via Modbus
  TCP data of an energy meter connected via Modbus RTU. The meter is displayed
  via an integrated Common Block and the subsequent Meter Model.
  The allocation of register addresses to the corresponding function can be found
  in the following tables:
- For all devices:
- Common Block (1)
- For inverters:
- Fronius Register
- Inverter model (101, 102, 103, 111, 112, or 113)
- Inverter Controls:
- Nameplate (120)
- Basic Settings (121)
- Extended Measurements & Status (122)
- Immediate Controls (123)
- Multiple MPPT Inverter Extension (160)
- Basic Storage Control (124)
  only available with Fronius Hybrid inverters
- For Fronius String Controls:
- String Combiner Model (403)
- For energy meters:
- Meter Model (201, 202, 203, 211, 212, or 213).
  NOTE!
  Only applies for Modbus RTU and only if no energy meter is connected:
  If no data exchange takes place on the RS-485 bus, noise and interference may
  affect the lines.
  In order for a receiver to remain in a defined status when there are no data si-
  gnals, bias resistors should be used in order to maintain a defined idle state on
  the data lines.
  The Fronius Datamanager does not have any bias resistors. Detailed information
  about the use of these resistors can be found in the document "MODBUS over
  serial line specification and implementation guide V1.02" (http://modbus.org/
  docs/Modbus_over_serial_line_V1_02.pdf).
  Maps Register Inverter Fronius String
  Control
  Energy Meter Sensor Card
  SID
  Identification as a
  SunSpec device
  SID
  Identification as a
  SunSpec device
  SID
  Identification
  as a SunSpec
  device
  SID
  Identification
  as a SunSpec
  device
  Common Block
  Device informati-
  on
  Common Block
  Device informati-
  on
  Common
  Block
  Device infor-
  mation
  Common
  Block
  Device infor-
  mation
  Inverter Model
  Inverter data
  String Combiner
  Model
  Fronius String
  Control data
  Meter Model
  Energy meter
  data
  Irradiance Mo-
  del
  Nameplate Model End Block End Block Back of Modu-
  le Temperatu-
  re Model
  Basic Settings
  Model
  Base Meteoro-
  logical Model
  Ext. Measure-
  ment Model
  End Block
  Immediate Con-
  trols Model
  Multi. MPPT Inv.
  Ext. Model
  Basic Storage
  Control (only in
  Fronius Hybrid in-
  verter)
  End Block
  The register lists can be downloaded from the Fronius homepage:
  https://www.fronius.com/de/downloads / Solar Energy / Modbus Sunspec Maps,
  State Codes und Events
  Englisch (US) 61
  Communication
  with the Modbus
  Master
  Response Times 62
  Communication with the Modbus master takes place using register addresses in
  accordance with the SunSpec Alliance specifications.
  (http://www.sunspec.org/)
  The data of an energy meter connected via Modbus RTU can be made available
  via Modbus TCP or via Modbus RTU (second interface). The meter is displayed via
  an integrated Common Block and the subsequent Meter Model.
  The allocation of register addresses to the corresponding function can be found
  in the following tables:
- For all devices:
- Common Block (1)
- For inverters:
- Inverter Model (101, 102, 103, 111, 112 or 113)
- Inverter Controls:
- Nameplate (120)
- Basic Settings (121)
- Extended Measurements & Status (122)
- Immediate Controls (123)
- Multiple MPPT Inverter Extension (160)
- Basic Storage Control (124)
- For energy meters:
- Meter Model (201, 202, 203, 211, 212 or 213)
  NOTE!
  Only applies for Modbus RTU and only if no energy meter is connected:
  if no data exchange takes place on the RS-485 bus, noise and interference may
  affect the lines.
  In order for a receiver to remain in a defined status when there are no data si-
  gnals, bias resistors should be used in order to maintain a defined idle state on
  the data lines.
  The Fronius Datamanager does not have any bias resistors. Detailed information
  about the use of these resistors can be found in the document "MODBUS over
  serial line specification and implementation guide V1.02" (http://modbus.org/
  docs/Modbus_over_serial_line_V1_02.pdf).
  The response times depend on factors such as the number of devices in the Fro-
  nius Solar Net ring. The higher the number of devices used, the longer the time-
  out for responses needs to be.
  NOTE!
  If there are several devices in the Fronius Solar Net ring, a timeout of at least
  10 seconds should be used when querying inverter data.
  Recommendation for timeout values
  Modbus queries should only be executed sequentially and not in parallel. Execute
  the queries with a timeout of at least 10 seconds. Queries at millisecond intervals
  can lead to long response times. Multiple register queries in one message are fas-
  ter than multiple queries of individual registers.
  When using Fronius String Controls, a single Modbus request might result in two
  requests being sent via Fronius Solar Net; this can lead to longer response times
  than when using inverter requests. If Fronius String Controls are present, you
  should therefore use a higher timeout value for responses.
  Modbus Device
  ID for Inverters
  Modbus Device
  ID for Fronius
  String Controls
  When first requesting common block data after restarting the Fronius Datama-
  nager, the information about the Fronius String Control must first be requested
  using Fronius Solar Net. For this reason, this first request will take a little more
  time than subsequent requests.
  If there are a larger number of devices in a Fronius Solar Net ring, it is advisable
  to split these between several Fronius Solar Net rings, which each have their own
  Fronius Datamanager, in order to speed up responses further. Fronius recom-
  mends operating a maximum of 6 inverters with a Datamanager.
  The inverter's Modbus device ID is the same as its inverter number, which can be
  set using the control panel on the inverter.
  (See the inverter operating instructions.)
  NOTE!
  There is only one exception to this rule:
  The inverter number 00 converts to device ID 100 because Modbus reserves de-
  vice ID 0 for broadcast messages.
  Example:
  Inverter number Modbus device ID
  00 100
  01 001
  02 002
  03 003
  99 099
  The Modbus device ID of a Fronius String Control is derived from
- its address in Fronius Solar Net
- a String Control offset value.
  The default value for the String Control offset is 101 because the range reserved
  for inverters goes up to Modbus device ID 100.
  The offset value can, however, be adjusted via the Fronius Datamanager web pa-
  ge.
  => see section "Data Output via Modbus"
  Example 1: String Control offset = 101 (standard value)
  Fronius String Control address Modbus device ID
  0 101
  1 102
  2 103
  99 200
  A Fronius Solar Net Ring allows up to 100 inverters and up to 200 Fronius String
  Controls. The available Modbus device IDs are reserved for other functions (e.g.,
  for energy meters) from 240.
  With the standard String Control offset of 101, it would therefore not be possi-
  Englisch (US) 63
  Modbus Device
  ID for Energy
  Meters
  Modbus device
  ID for Fronius
  Sensor Cards
  Event Flags 64
  ble to have Fronius String Control addresses from 139 (which corresponds to
  Modbus ID 240) upwards.
  For this reason, it is possible to adjust the String Control offset on the Fronius
  Datamanager website if fewer than 100 inverters are being used.
  Example 2: 30 inverters, 200 Fronius String Controls, String Control offset =
  40
  Fronius String Control address 0 40
  1 41
  2 42
  199 239
  Modbus device ID
  If an energy meter (e.g., Fronius Smart Meter 63A) is connected to the Fronius
  Datamanager via Modbus RTU, it can be read out via the fixed Modbus device
  ID using Modbus TCP.
  Fronius Smart Meter Address 1 240
  2 241
  3 242
  4 243
  5 244
  Modbus Device ID
  If a Fronius Sensor Card is connected to the Fronius Datamanager via Solar Net,
  it can be read out via a fixed Modbus device ID.
  The Modbus device ID of a Fronius Sensor Card is derived from
- your address in the Fronius Solar Net
- the Sensor Card offset value 245
  Fronius Sensor Card address 0 245
  1 246
  2 247
  Modbus device ID
  Status changes and faults in the inverters and Fronius String Controls are shown
  as event flags.
  Detailed information and lists can be downloaded in various formats (xlsx, csv,
  json) from the Fronius website:
  https://www.fronius.com/de/downloads / Solar Energy / Modbus SunSpec Maps,
  State Codes and Events
  NOTE!
  It is also possible to combine several state codes for one event.
  For inverters:
  An accurate description of the state codes can be found in the operating instruc-
  tions of the relevant inverter.
  If the inverter generates a state code, the relevant event flag is set in the Fronius
  Datamanager.
  NOTE!
  In addition, the relevant state code is also displayed in register F_Active_Sta-
  te_Code (214).
  The event flag and state code will remain active for as long as the state code is
  displayed on the inverter. If another state code is generated, it will also be dis-
  played in the event flags. In this case, there is a chance that the previous event
  flag will not be deleted.
  It is therefore possible to manually delete the event flags and the state code
  by entering 0xFFFF in register F_Reset_All_Event_Flags (215).
  Register addres-
  ses
  IMPORTANT!
- Register addresses do not remain constant.
- The actual register addresses depend on the composition of the dynamic
  SunSpec register list.
  Correct procedure:
- Search for the model by making a request (determine start address)
- Then work with offsets
  To read a register, the register's start address must be specified in the Modbus
  request.
  Fronius Basic Register: 212
  SunSpec Basic Register: 40001
  Registers begin at 1 and do not represent a function code.
  Do not confuse the registers with the Modicon address scheme:
  In the Modicon address scheme, 40001 is displayed as 4x40001.
  To read register 40001, use address 40000 (0x9C40).
  The register address that is output therefore always has 1 number less than the
  actual register number.
  IMPORTANT!
  The lengths of individual models may vary due to the data types used.
  Start addresses are therefore specified for SunSpec models in the case of some
  register tables.
  This start address, together with the offset from the table, then produces the va-
  lue of the actual register number.
  Example: Table Nameplate Model (120) on page 81:
  The register WRtg of the nameplate model has an offset of 4. The start address
  is specified as 40131 with the setting "float".
  Therefore, the correct register number is: 40131 + 4 = 40135.
  Englisch (US) 65
  Examples for Modbus RTU:

1. Request for four registers starting from register 40005 (Mn, Manufacturer)
   Send (bytes in hexadecimal)
   01 03 9C 44 00 04 2A 4C
   De-
   vice
   ID
   Func-
   tion
   code
   Address
   40004 (cor-
   responds to
   register

40005)  Number of
        registers to
        be read
        Checksum
        Low
        byte
        High
        byte
        Receive (bytes in hexadecimal)
        01 03 08 46 72 6F 6E 69 75 73 00 8A 2A
        De-
        vice
        ID
        Func-
        tion
        code
        Num-
        ber of
        bytes
        Address
        40005
        "F" and "r"
        Address
        40006
        "o" and "n"
        Address
        40007
        "i" and "u"
        Address
        40008
        "s" and 0
        Checksum
        Low
        byte
        High
        byte

2. Enter one register starting from register 40242 (WmaxLimPct)
   01 10 9D 32 00 01 02 13 88 E3 DD
   De-
   vice
   ID
   Func-
   tion
   code
   Address
   40242
   Number of
   registers to
   be entered
   Number
   of data
   bytes still
   to follow
   Register
   value to
   be ente-
   red
   0x1388 =
   5000
   Checks-
   um
   Low
   byte
   High
   byte
   01 10 9D 32 00 01 8F AA
   De-
   vice
   ID
   Func-
   tion
   code
   Address
   40242
   Number of
   registers en-
   tered
   Checksums
   "i" and "u"
   400
   08
   "s"
   and
   0
   Low
   byte
   High
   byte
   66
   Examples for Modbus TCP:
1. Request for four registers starting from register 40005 (Mn, Manufacturer)
   Send (bytes in hexadecimal)
   MBAP hea-
   der
   03 9C 44 00 04
   For details, see
   description of
   MBAP header
   Func-
   tion
   code
   Address 40004
   (corresponds to
   register 40005)
   Number of
   registers to
   be read
   Receive (bytes in hexadecimal)
   MBAP hea-
   der
   03 08 46 72 6F 6E 69 75 73 00
   For details, see
   description of
   MBAP header
   Func-
   tion
   code
   Num-
   ber of
   bytes
   Address
   40005
   "F" and "r"
   Address
   40006
   "o" and "n"
   Address
   40007
   "i" and "u"
   Address
   40008
   "s" and 0
1. Enter one register starting from register 40242 (WmaxLimPct)
   MBAP hea-
   der
   10 9D 32 00 01 02 13 88
   For details, see
   description of
   MBAP header
   Func-
   tion
   code
   Address 40242 Number of
   registers to
   be entered
   Number of
   data bytes
   still to fol-
   low
   Register va-
   lue to be en-
   tered
   0x1388 =
   5000
   MBAP hea-
   der
   10 9D 32 00 01
   For details, see
   description of
   MBAP header
   Func-
   tion
   code
   Address 40242 Number of
   registers en-
   tered
   Englisch (US) 67
   Unavailable data
   records
   Fronius inverters cannot always provide all the data specified in the SunSpec
   data models. Depending on the data type, this data is represented by the fol-
   lowing values in accordance with the SunSpec specification:

- int16 (-32767 to 32767):
- uint16 (0 to 65534):
- acc16 (0 to 65535):
- enum16 (0 to 65534):
- bitfield16 (0 to 0x7FFF):
- pad (0x8000):
- int32 (-2147483647 to 2147483647):
- uint32 (0 to 4294967294):
- acc32 (0 to 4294967295):
- enum32 (0 to 4294967294):
- bitfield32 (0 to 0x7FFFFFFF):
- int64 (-9223372036854775807 to
  9223372036854775807):
- uint64 (0 to 18446744073709551615):
  0x80001)
  0xFFFF
  0
  0xFFFF
  0xFFFF
  always 0x8000
  0x80000000
  0xFFFFFFFF
  0
  0xFFFFFFFF
  0xFFFFFFFF
  0x8000000000000
  000
  FFF
  0
  all X registers filled
  with 0x0000
  0x7FC00000 (NaN)
  0x8000
  0xFFFFFFFFFFFFF
- acc64 (0 to 18446744073709551615):
- stringX:
- float32 (range see IEEE 754):
- sunssf (scale factors; -10 to 10):

1. The prefix "0x" stands for hexadecimal numbers.
   NOTE!
   Data points that are not supported are marked with "Not supported" in the
   "Range of values" column in the register tables.
   In this case, during reading, the corresponding value from the list above is obtai-
   ned depending on the data type.
   In certain instances, registers which are basically listed as supported may also
   return this value. This is because some values depend on the device type, e.g.,
   currents AphB and AphC in the case of a single-phase inverter.
   Time Response
   of the Supported
   Operating Modes
   Time Response Illustrated by Power Reduction
   68
   Sign Convention
   for the Power
   Factor
   The inverter's time response in an operating mode can be defined by several time
   values.
   Three possible time values are shown in the figure "Time response illustrated by
   power reduction":

- WinTms 0–300 [seconds]
  Specifies a time window in which the operating mode is randomly started.
  The time window starts when the start command for the operating mode is
  issued (e.g., OutPFSet_Ena = 1).
  WinTms can be used to prevent all the inverters in the system from applying
  the changes at the same time. If the time window is set to 0 (the default va-
  lue), the operating mode will start immediately.
- RvrtTms 0–28800 [seconds]
  Determines how long the operating mode will remain active. The timer is re-
  started with every Modbus message received. If no new Modbus message
  was received during the fallback time (= RvrtTms), the operating mode is au-
  tomatically ended and the operating mode with the next highest priority (Da-
  tamanager web interface - Settings - UC Editor) becomes active, e.g., dyna-
  mic power reduction. If RvrtTms is 0 (the default value), the operating mode
  remains active until it is manually deactivated via the corresponding register.
  In this instance the fallback option is not available.
- RmpTms (supported from version 1.11.3-2 (Hybridmanager) / 3.13.3-2 (Data-
  manager))
  Specifies how quickly the changes are to be made. The corresponding value
  gradually changes during the specified time period from the old to the new
  value.
  If RmpTms is 0 (the default value) or if this value is not supported, the new
  value will be valid immediately.
  Quadrant 2
  (+kVAr, +kVArh)
  90°
  Power factor sign
  convention
  EEI: +
  (Leading, capacitive)
  Power factor sign
  convention
  EEI: -
  (Lagging, inductive)
  Reactive Power
  Exported/Received (Var)
  Apparent Power (VA)
  ϕ
  Apparent Power (VA)
  ϕ
  Reactive Power
  Exported/Received (Var)
  Quadrant 1
  Active Power
  Exported/Received (W)
  Active Power
  Exported/Received (W)
  (-kW,
  -kWh)
  Active Power
  Exported/Received (W)
  Active Power
  Exported/Received (W)
  0°
  (+kW,
  +kWh)
  ϕ
  Apparent Power (VA) ϕ
  Apparent Power (VA)
  180°
  Reactive Power
  Exported/Received (Var)
  Reactive Power
  Exported/Received (Var)
  Power factor sign
  convention
  EEI: -
  (Lagging, inductive)
  Power factor sign
  convention
  EEI: +
  (Leading, capacitive)
  Quadrant 3
  270°
  (-kVAr, -kVArh)
  Quadrant 4
  The EEI sign convention1) for the power factor is in line with the SunSpec specifi-
  cation and is based on the information contained in the "Handbook for Electricity
  Metering" and IEC 61557-12 (2007).
  Englisch (US) 69
  The power factor is:
- negative if the reactive power is positive (over-excited, quadrant 1)
- positive if the reactive power is negative (under-excited, quadrant 4)

1. EEI = Edison Electrical Institute
   Values Saved on
   the Card
   Nameplate Model (IC120):

- WRtg
  AC nominal output of inverter.
- VARtg
  AC nominal apparent output of inverter.
  Default value = WRtg
- VArRtgQ1
  Maximum AC reactive power in the first quadrant (over-excited).
  Default value is calculated based on the available cos Phi (0.85) and the no-
  minal apparent power. Note the scaling factor VArRtg_SF.
- VArRtgQ4
  Maximum AC reactive power in the fourth quadrant (under-excited).
  Default value is calculated based on the available cos Phi (0.85) and the no-
  minal apparent power. Note the scaling factor VArRtg_SF.
- ARtg
  AC nominal current of inverter.
  Basic Settings Model (IC121):
- WMax
  Maximum AC power
  Default value = WRtg
- VRef
  Reference voltage at the feed-in point
- VRefOfs
  Deviation from reference voltage
- VMax
  Maximum AC voltage
- VMin
  Minimum AC voltage
- VAMax
  Maximum AC apparent power
  Default value = VARtg
  Saving Values
  If data is not available or is incorrectly displayed, the values listed above can be
  adjusted and saved on the Datamanager.
  Changes currently have no influence on the way the Datamanager or the inver-
  ters function and are merely used to display device-specific information.
  In order to save the values, the register F_Store_Data (213) of any inverter must
  be written with 0xFFFF. The values for all inverters are then permanently saved
  and are also available after an AC reset of the Datamanager.
  Deleting Values
  It is only possible to delete values for an individual inverter. To do this, enter
  0xFFFF into the register F_Delete_Data (212) of the relevant inverter.
  Scale Factors IMPORTANT! Scale factors (also possible when selecting “Float”!) are not static,
  even if they are entered as a fixed value in these Operating Instructions.
  Scale factors can change every time the firmware is changed (e.g., scale factor
  for power specification).
  70
  Scale factors with constant values are listed in the tables in the column “Range
  of values”.
  Current data (data of inverters, Fronius String Controls, and energy meters) may
  have variable scale factors. These must be read from the corresponding registers.
  The data type "sunssf" is a signed integer with 16 bits.
  Example calculation:
  (Model 160): 1_DCW = 10000, DCW_SF = -1 -> Power = 10000 x 10^(-1) = 1000
  W
  Non-writable re-
  gisters
  The following registers cannot be written:
- Read-only (R) registers
- Registers which are currently not supported
  NOTE!
  If an attempt is made to write to such registers, the inverter does not return an
  exception code!
  The values written to these registers are ignored without an error message.
  In Model 123 and 124, an exception occurs during write access if the control op-
  tion in the local web interface has been deactivated.
  Entering Invalid
  Values
  Some registers only permit certain values. The valid values can be found in the
  relevant register table.
  If an invalid value is entered into a register, the inverter control will return excep-
  tion code 3 (illegal data value). The invalid value is ignored.
  Englisch (US) 71
  Modbus Settings
  General From your web browser, you can use the Fronius Datamanager web interface to
  apply the Modbus connection settings which cannot be accessed via the Modbus
  protocol.
  NOTE!
  It is not necessary to use a web interface when transferring data via Modbus
  RTU since Modbus RTU is enabled at the factory, except for Symo Hybrid.
  Opening the
  Modbus Settings
  1 Install Fronius Datamanager
  => see the Fronius Datamanager operating instructions.
  2 Open Internet browser
  3 Enter the following in the address field of the Internet browser:
- the IP address of the Fronius Datamanager (can be accessed via System
  Information)
- or host name and domain name of the Fronius Datamanager.
  The web interface's start page is displayed.
  4 Select the "Settings" section (1).
  5 Open the "Modbus" section (2).
  (1)
  (2)
  NOTE!
  In the case of Fronius Datamanager 2.
  0, the "Data output via Modbus" is set to rtu in the factory.
  The rtu option is not available for the Datamanager 1.
  72
  Open the Mod-
  bus settings
  1 Open the web interface of the inverter
  2 Select the "Communication" section (1)
  3 Open the "Modbus" menu item (2)
  Data Output via
  Modbus
  Data Output via Modbus
  Activation of the Modbus service and selection of the transmission pro-
  tocol.
  If the Modbus service is activated, additional entry fields are available.
  The Modbus rtu transmission protocol is only available for Fronius Data-
  manager 2.0.
  Note! If there is a Modbus energy meter (e.g., Fronius Smart Meter) configured
  under Settings/Meter on the system, it will not be possible to use the "rtu" set-
  ting. In this case, data output via Modbus will be deactivated automatically upon
  selection of "rtu." This change will only be visible once the Datamanager website
  has been reloaded.
  Any energy meter connected via RS485 can also be read by Modbus TCP via the
  corresponding SunSpec models. The Modbus ID for the meter is 240.
  (1) off
  No data output via Modbus.
  If the data output via Modbus is deactivated, control commands sent to
  the inverter via Modbus are reset, e.g., no power reduction or no reactive
  power specification.
  (2) tcp
  Data output via Modbus TCP.
  Englisch (US) 73
  (2a) (2b) (2c) (2d) (2e) (2f) (3) 74
  (2)
  (2a)
  (2b)
  (2c) (2d)
  (2e)
  (2f)
  (2g)
  (2h)
  Modbus port
  Number of the TCP port to be used for Modbus communication.
  Presetting: 502
  Port 80 cannot be used for this purpose.
  String Control address offset
  Offset value used to assign addresses to Fronius String Controls via
  Modbus.
  For further details, see the section entitled "Modbus Device ID for Fro-
  nius String Controls."
  SunSpec Model Type
  Used to select the data type of data models for inverters and energy
  meters.
  float
  Display as floating-point numbers.
  SunSpec inverter model 111, 112 or 113
  SunSpec meter model 211, 212 or 213
  int+SF
  Display as integers with scaling factors.
  SunSpec inverter model 101, 102 or 103
  SunSpec meter model 201, 202 or 203
  IMPORTANT! Since the different models have different numbers of re-
  gisters, the register addresses of all the subsequent models also change
  when the data type is changed.
  Demo mode
  The demo mode is used to implement or validate a Modbus master. It
  enables you to read inverter, energy meter, and Fronius String Control
  data without actually having to connect or activate a device. The same
  data are always sent back for all the registers.
  Inverter control via Modbus
  If this option is activated, the inverter can be controlled via Modbus.
  The "Restrict the control" selection field is displayed.
  Inverter control includes the following functions:
- On/off
- Power reduction
- Setting a constant power factor (cos phi)
- Setting a constant reactive power
- Battery control specifications for Symo Hybrid with battery
  rtu
  Data output via Modbus rtu.
  (3a) (3b) (3c) (3d) (3e) (3f) (3g) (4) (3)
  (3a)
  (3b)
  (3d) (3e)
  (3f)
  (3g)
  (3c)
  Baud rate
  Used to enter the baud rate.
  Parity
  Selection field for entering the parity.
  String Control address offset
  Offset value used to assign addresses to Fronius String Controls via
  Modbus.
  For further details, see the section entitled "Modbus Device ID for Fro-
  nius String Controls."
  SunSpec model type
  Used to select the data type of data models for inverters.
  float
  Display as floating-point numbers.
  SunSpec inverter model 111, 112 or 113
  int+SF
  Display as integers with scaling factors.
  SunSpec inverter model 101, 102 or 103
  IMPORTANT! Since the different models have different numbers of re-
  gisters, the register addresses of all the subsequent models also change
  when the data type is changed.
  Demo mode
  The demo mode is used to implement and validate a Modbus master. It
  enables you to read inverter, energy meter, and Fronius String Control
  data without actually having to connect or activate a device. The same
  data are always sent back for all the registers.
  Inverter control via Modbus
  If this option is activated, the inverter is controlled via Modbus.
  Inverter control includes the following functions:
- On/off
- Power reduction
- Setting a constant power factor (cos phi)
- Setting a constant reactive power
- Battery control specifications for Symo Hybrid with battery
  Controlling priority
  Used to specify which service is given priority by the inverter control
  unit.
  1 = highest priority, 3 = lowest priority.
  The control priorities can only be changed in the UC EDITOR menu
  item.
  Englisch (US) 75
  Limiting control Save or Reject
  Changes
  76
  (5) "Apply/Save" button
  (6) "Cancel/Discard entries" button
  The "Limit Control" option is only available for the TCP transmission protocols.
  It is used to block inverter control commands from unauthorized users by only
  permitting control for specific devices.
  Limit Control
  If this option is activated, only certain devices will be able to send control com-
  mands.
  IP address
  To limit inverter control to one or more devices, enter the IP addresses of the de-
  vices which are permitted to send commands to the inverter in this field. Multiple
  entries are separated by commas.
  Examples:
- One IP address: 98.7.65.4
- Control only permitted by IP address 98.7.65.4
- Several IP addresses: 98.7.65.4,222.44.33.1
- Control only permitted by IP addresses 98.7.65.4 and 222.44.33.1
- IP address range, e.g., from 98.7.65.1 to 98.7.65.254 (CIDR notation):
  98.7.65.0/24
- Control only permitted by IP addresses 98.7.65.1 to 98.7.65.254
  Saves the changes and displays a message confirming this.
  If you exit the Modbus section without saving your changes, all the changes you
  have made will be rejected.
  Prompts you to confirm whether or not you wish to reject the changes you
  have made and then reinstates the most recently saved values.
  Fronius Registers
  Fronius Register These registers only apply to inverters. These registers are not relevant to Froni-
  us String Controls and energy meters.
  The Register tables can be found on the Fronius homepage or opened using the
  link:
  http://www.fronius.com/QR-link/0006
  Inverter Status
  Code
  Register F_Active_State_Code (214) displays the inverter status code which has
  just been generated. This may also be displayed on the inverter’s display. This
  code is also displayed as an event flag in the inverter model. The displayed code
  remains active for as long the inverter has the corresponding status. Alterna-
  tively, the status can also be deleted by using register F_Reset_All_Event_Flags.
  Deleting Event
  Flags and Status
  Codes
  The event flags in the inverter models (101, 102, 103 and 111, 112, 113) remain
  active until the corresponding status is no longer present on the inverter. There
  are a few exceptional cases in which the event flags are not deleted. For this rea-
  son, it is possible to reset the event flags and the displayed status code by is-
  suing the Modbus command.
  1 Enter 0xFFFF in register F_Reset_All_Event_Flags (215)
  The content of the following registers is deleted:
- F_Active_State_Code (214)
- Evt1
- Evt2
- EvtVnd1 to EvtVnd4
  Saving and Dele-
  ting Data
  If the value 0xFFFF is written in the register F_Store_Data(213), then all nomi-
  nal values (ratings) for all inverters are saved on the Fronius Datamanager. These
  values can be changed in the corresponding registers of the Nameplate Model
  and the Basic Settings Model. This can be useful if, for example, no nominal va-
  lues could be automatically determined for a device and you want to enter the
  values manually.
  If you want to delete the saved values for a particular inverter, you must write the
  value 0xFFFF in the F_Delete_Data(212) register. The values are then only dele-
  ted for this inverter. The deletion can only ever be applied to the inverter with
  which there is currently communication.
  Changing the
  Data Type
  The data type for the data models for inverters and energy meters can be selec-
  ted via the F_ModelType(216) register. It is possible to select either display as
  floating point numbers (float, standard) or as integers with scale factors (int+SF).
  Englisch (US) 77
  System Totals 78
  NOTE!
  This setting only relates to the inverter model (inverter) and the meter model
  (energy meter).
  All other models continue to use integers and scale factors.
  This setting functions in the same way as the web interface Modbus settings –
  SunSpec model type.
  Setting options:
- Float = 1 (standard): Inverter model 111, 112, or 113; meter model 211, 212,
  or 213
- int+SF = 2: Inverter model 101, 102, or 103; meter model 201, 202, or 203.
  NOTE!
  Since the different models have different numbers of registers, the register ad-
  dresses of all the subsequent models also change when the data type is chan-
  ged.
  NOTE!
  To avoid accidental changes, writing a value to setting F_ModelType must be
  confirmed by writing value 0x06 to the same register immediately after writing
  the type.
  If the confirmation is omitted, changes will be reset after a few seconds.
  The following registers can be used to query power and energy data from all in-
  verters connected to this Fronius Datamanager via Fronius Solar Net.
  These values are displayed in Watt (W) or Watt hours (Wh) and do not require
  scale factors.
- F_Site_Power(500–501): Power
- F_Site_Energy_Day(502–505): Daily Energy
- F_Site_Energy_Year(506–509): Yearly Energy
- F_Site_Energy_Total(510–513): Total energy of the entire system.
  Common & Inverter Model
  Common Block
  Register
  The description of the Common Block including the SID register (register
  40001–40002) for identification as a SunSpec device applies for each device ty-
  pe (inverter, Fronius String Control, energy meter). Each device has its own Com-
  mon Block, which lists information about the device (model, serial number, SW
  version, etc.).
  The Register tables can be found on the Fronius homepage or opened using the
  link:
  http://www.fronius.com/QR-link/0006
  Inverter Model
  Register
  Two different SunSpec Models are supported for the inverter data:
- the default set inverter model with floating point display
  (setting "float"; 111, 112 or 113)
- the inverter model with integers and scaling factors
  (setting "int+SF"; 101, 102 or 103)
  The register number of the two model types is different!
  The Register tables can be found on the Fronius homepage or opened using the
  link:
  http://www.fronius.com/QR-link/0006
  SunSpec Opera-
  ting Codes
  Name Value Description
  I_STATUS_OFF 1 Inverter is off
  I_STATUS_SLEEPING 2 Auto shutdown
  I_STATUS_STARTING 3 Inverter starting
  I_STATUS_MPPT 4 Inverter working normally
  I_STATUS_THROTTLED 5 Power reduction active
  I_STATUS_SHUT-
  TING_DOWN
  6 Inverter shutting down
  I_STATUS_FAULT 7 One or more faults present, see
  St*or Evt* register
  I_STATUS_STANDBY 8 Standby

* Inverter model register
  Fronius Opera-
  ting Codes
  Name Value Description
  I_STATUS_OFF 1 Inverter is off
  I_STATUS_SLEEPING 2 Auto shutdown
  I_STATUS_STARTING 3 Inverter starting
  Englisch (US) 79
  Name Value Description
  I_STATUS_MPPT 4 Inverter working normally
  I_STATUS_THROTTLED 5 Power reduction active
  I_STATUS_SHUTTING_DOWN 6 Inverter shutting down
  I_STATUS_FAULT 7 One or more faults present, see
  St*or Evt* register
  I_STATUS_STANDBY 8 Standby
  I_STATUS_NO_BUSINIT 9 No SolarNet communication
  I_STATUS_NO_COMM_INV 10 No communication with inverter
  possible
  I_STATUS_SN_OVERCURRENT 11 Overcurrent detected on Solar-
  Net plug
  I_STATUS_BOOTLOAD 12 Inverter is currently being up-
  dated
  I_STATUS_AFCI 13 AFCI event (arc detection)
* Inverter model register
  80
  Nameplate Model (120)
  General This model corresponds to a rating plate. The following data can be read:

- DERType (3)
  Type of device. The register returns the value 4 (PV device).
- WRtg (4)
  Nominal power of inverter.
- VARtg (6)
  Nominal apparent power of inverter.
- VArRtgQ1 (8) – VArRtgQ4 (11)
  Nominal reactive power values for the four quadrants.
- ARtg (13)
  Nominal current of inverter.
- PFRtgQ1 (15) – PFRtgQ4 (18)
  Minimal power factor values for the four quadrants.
  Nameplate Re-
  gister
  Start address:
- for "float" setting: 40131
- for "int+SF" setting: 40121
  The Register tables can be found on the Fronius homepage or opened using the
  link:
  http://www.fronius.com/QR-link/0006
  Englisch (US) 81
  Basic Settings Model (121)
  Basic Settings
  Register
  Start address:
- for "float" setting: 40159
- for "int+SF" setting: 40149
  The Register tables can be found on the Fronius homepage or opened using the
  link:
  http://www.fronius.com/QR-link/0006
  Reference Volta-
  ge
  VRef (4)
  The reference voltage is the voltage at the joint connection point where the local
  grid is connected to the public grid. The reference voltage is the same as the in-
  verter's nominal voltage.
  => See figure "Joint Connection Point."
  The value is given in volts in the range of 0 (0x0000) to 400 (0x0190).
  Example Settings
  = Electrical Connection Point (ECP)
  VRefOfs = 4V
  VRefOfs = 2V
  Utility Power System
  Local Bus
  VRefOfs = 3V
  Local Power
  System with
  Line Resistors
  Point of Common
  Coupling (PCC)
  VRef = 120V
  DER interconnections
  Joint Connection Point
  Deviation from
  Reference Volta-
  ge
  VRefOfs (5)
  Depending on the wiring of the local grid, there may be a deviation from the refe-
  rence voltage at the point where each individual inverter is connected to the local
  grid (see "Joint connection point" diagram).
  The value is given in volts in the range of -20 (0xFFEC) to 20 (0x0014).
  82
  Extended Measurements & Status Model (122)
  General This model provides some additional measurement and status values which the
  normal inverter model does not cover:
- PVConn (3)
  This bit field displays the inverter's status
- Bit 0: Connected
- Bit 1: Responsive
- Bit 2: Operating (inverter feeds energy in)
- ECPConn (5)
  This register displays the status of connection to the grid
- ECPConn = 1: Inverter is currently feeding power into the grid
- ECPConn = 0: Inverter is not feeding power into the grid
- ActWH (6–9)
  Active energy meter
- StActCtl (36–37)
  Bit field for currently active inverter modes
- Bit 0: Power reduction (FixedW; corresponds to WMaxLimPct specificati-
  on)
- Bit 1: Constant reactive power specification (FixedVAR; corresponds to
  VArMaxPct)
- Bit 2: Setting a constant power factor (FixedPF; corresponds to OutPF-
  Set)
- TmSrc (38–41)
  Source for the time synchronization, the register returns the string "RTC"
- Tms (42–43)
  Current time and date of the RTC
  The seconds are specified from January 1, 2000 00:00 (UTC) to the current
  time.
  Extended Mea-
  surements &
  Status Register
  Start address:
- for "float" setting: 40191
- for "int+SF" setting: 40181
  The Register tables can be found on the Fronius homepage or opened using the
  link:
  http://www.fronius.com/QR-link/0006
  Englisch (US) 83
  Immediate Control Model (123)
  General The immediate controls can be used to make the following settings on the inver-
  ter:
- deactivation of inverter's grid power feed operation (standby)
- constant reduction of output power
- specification of a constant power factor
- specification of a constant relative reactive power
  In the settings on the inverter's web interface, the setting "Inverter control via
  Modbus" must be enabled under Modbus for write functions to be possible. De-
  pending on the control priority that has been set (IO control, dynamic power re-
  duction, or control via Modbus), Modbus commands may not be accepted.
  Immediate Con-
  trols Register
  Start address:
- for "float" setting: 40237
- for "int+SF" setting: 40227
  The Register tables can be found on the Fronius homepage or opened using the
  link:
  http://www.fronius.com/QR-link/0006
  Standby Conn_WinTms (3) to Conn (5)
  These registers are used to control the standby mode (no grid power feed opera-
  tion) of the inverter.
  Conn_WinTms (3) and Conn_RvrtTms (4)
  These registers can be used to control the inverter's time response. => See sec-
  tion "Time Response of the Supported Operating Modes".
  0 is set as the default for all registers.
  Conn (5)
  Register Conn indicates whether or not the inverter is currently feeding power in-
  to the grid (0 = standby, 1 = grid power feed operation).
- In order to switch the inverter to standby, enter the value 0 into this register.
- In order to reactivate the inverter, enter the value 1 into this register.
  NOTE!
  To find out whether or not the inverter is feeding power into the grid, you can
  also use the ECPConn register and check the extended measurements and sta-
  tus model.
  Power reduction WMaxLimPct (6) to WMaxLim_Ena (10)
  These registers can be used to set an output power reduction in the inverter.
  WMaxLimPct (6)
  In register WMaxLimPct you can enter values between 0% and 100%. Depending
  on the inverter’s software version, values below 10 may force the inverter into
  standby (no grid power feed operation).
  84
  Example:
  Setting a Power
  Reduction
  Example:
  Changing the
  Return Time
  When Power Re-
  duction Has Be-
  en Activated
  The values limit the device’s maximum possible output power and therefore may
  not necessarily affect the real-time power.
  IMPORTANT! Observe the scale factor for this register.
  Further information can be found at:
  http://sunspec.org/wp-content/uploads/2015/06/SunSpec-Information-Mo-
  dels-12041.pdf
  WMaxLimPct_WinTms (7), WMaxLimPct_RvrtTms (8)
  These registers can be used to control the inverter’s time response for this ope-
  rating mode. => See section “Time Response of the Supported Operating Mo-
  des.”
  0 is set as the default for all registers.
  WMaxLim_Ena (10)
  Used to start and end this operating mode
- Enter value 1 into register WMaxLim_Ena = start operating mode
- Enter value 0 into register WMaxLim_Ena = end operating mode
  NOTE!
  Proceed as follows to change values when an operating mode is active (e.
  g., when setting a different power limit or return time):
  ▶ Enter the new value into the relevant register
  ▶ Restart the operating mode using register WMaxLim_Ena
  If you are working with function code 0x10 (write multiple registers), perfor-
  mance specifications can be used to achieve a higher level of performance. Ins-
  tead of using two Modbus commands, it is now possible to preset both the power
  and enable at the same time with just one command. All 5 registers
  (WMaxLimPct, WMaxLimPct_WinTms, WMaxLimPct_RvrtTms,
  WMaxLimPct_RmpTms, WMaxLim_Ena) can be written with one command. Wri-
  ting to the non-supported "Read Only" register WMaxLimPct_RmpTms takes
  place without returning an otherwise usual exception (error) code.
  For example, register values for 80% specification without timing specification:
  8000, 0, 0, 0, 1
  1 Enter the value for the output power reduction in register WMaxLimPct
  (e.g., 30 for 30%).
  2 As an option, you can set the start and return time using registers
  WMaxLimPct_WinTms and WMaxLimPct_RvrtTms.
  3 Start the operating mode by entering 1 in register WMaxLim_Ena.
  IMPORTANT! Observe the scale factor for this register.
  Further information can be found at:
  http://sunspec.org/wp-content/uploads/2015/06/SunSpec-Information-Mo-
  dels-12041.pdf
  If the power reduction was originally started using WMaxLimPct_RvrtTms = 0,
  the operating mode must be manually deactivated.
  1 Set WMaxLimPct_RvrtTms to 30, for example
  Englisch (US) 85
  2 Apply the change by entering 1 in register WMaxLim_Ena
- The operating mode is automatically deactivated after 30 seconds and
  the mode with the next highest priority becomes active (e.g., dynamic
  power reduction)
  Effects of Reac-
  tive Power Spe-
  cifications on Ef-
  fective Power
  In principle, reactive power operation is limited by the maximum output current
  (the maximum apparent power) and by the operative reactive power limit of the
  inverter:
- Fronius Galvo cos phi = 0.85, VArrel = 53%
- Fronius Symo cos phi = 0.7, VArrel = 71%.
  NOTE!
  Due to the current technical conditions, only a cos phi up to a maximum of ±0.
  80 can be specified per Modbus. In some circumstances, however, VArrel specifi-
  cations may demand a lower value.
  The following diagram shows the possible working area of the inverter. All valid
  operating points defined by effective power P and reactive power Q are within
  the gray area.
  Under-excited (inductive) Over-excited (capacitive)
  Reactive Power and Power Factor
  Legend:
  W Power VArma
  Nominal reactive power
  x
  Wmax
  VAr
  Nominal power
  Reactive power
  VArrel Relative reactive power
  (VAr/VArmax)
  86
  Constant Power
  Factor
  OutPFSet (11) to OutPFSet_Ena (15)
  These registers can be used to set a constant power factor in the inverter.
  OutPFSet (11)
- In register OutPFSet it is possible to enter both positive and negative values
  for the power factor.
- The values must be scaled up by the factor in register OutPFSet_SF.
- The lowest possible values depend on the inverter type and can be found in
  the Nameplate Model.
  NOTE!
  The power factor value must be entered with the correct sign, see section "Sign
  Convention for the Power Factor"
  ▶ positive for under-excited
  ▶ negative for over-excited.
  OutPFSet_WinTms (12), OutPFSet_RvrtTms (13)
  These registers can be used to control the inverter's time response for this ope-
  rating mode. => See section "Time Response of the Supported Operating Modes".
  0 is set as the default for all registers.
  OutPFSet_Ena (15)
  Used to start and end this operating mode
- Enter value 1 into register OutPFSet_Ena = start operating mode
- Enter value 0 into register OutPFSet_Ena = end operating mode.
  NOTE!
  Proceed as follows to change values when an operating mode is active (e.g.,
  when setting a different power factor or return time):
  ▶ Enter the new value into the relevant register
  ▶ Restart the operating mode using register OutPFSet_Ena.
  Example:
  Setting a Con-
  stant Power Fac-
  tor
  1 Enter the power factor value in register OutPFSet
  (e.g., 950 for 0.95).
  2 As an option, you can set the start and return time using registers OutPF-
  Set_WinTms and OutPFSet_RvrtTms.
  3 Start the operating mode by entering 1 in register OutPFSet_Ena.
  Englisch (US) 87
  Constant Relati-
  ve Reactive
  Power
  VArMaxPct (17) to VArPct_Ena (23)
  These registers can be used to set on the inverter a constant value for the reacti-
  ve power to be produced by the inverter.
  VArMaxPct (17)
- Used to set a value for constant reactive power.
- The minimum and maximum limits depend on the type of inverter.
  NOTE!
  In practical operation, the reactive power that is actually available is specified
  by the inverter's operating limits.
  For this reason, the reactive power specification can only be reached if enough
  effective power is fed into the grid.
  If too little effective power is fed into the grid, the inverter will operate at its
  operating limit.
  VArPct_WinTms (19), VArPct_RvrtTms (20)
  These registers can be used to control the inverter's time response for this ope-
  rating mode. => See section "Time Response of the Supported Operating Modes".
  0 is set as the default for all registers.
  VArPct_Mod (22)
- This register cannot be changed.
- It returns the (currently) supported operating mode.
  Reactive power as a percentage of the maximum possible reactive power.
  VArPct_Ena (23)
  Used to start and end this operating mode
- Enter value 1 into register VArPct_Ena = start operating mode
- Enter value 0 into register VArPct_Ena = end operating mode.
  NOTE!
  Proceed as follows to change values when an operating mode is active (e.
  g., when setting a different reactive power value or return time):
  ▶ Enter the new value into the relevant register.
  ▶ Restart the operating mode using register VArPct_Ena.
  Example:
  Setting Constant
  Reactive Power
  1 Enter the relative reactive power value in register VArMaxPct
  (e.g., 80 for 80%).
  2 As an option, you can set the start and return time using registers
  VArPct_WinTms and VArPct_RvrtTms.
  3 Start the operating mode by entering 1 in register VArPct_Ena.
  88
  Multiple MPPT Inverter Extension Model (160)
  General The Multiple MPPT Inverter Extension Model contains the values of up to two DC
  inverter inputs.
  If the inverter has two DC inputs, then this is where the current, voltage, power,
  energy, and status codes for the individual inputs are listed. In the inverter model
  (101–103 or 111–113), only the full DC power of both inputs is output in this ca-
  se. DC current and DC voltage are displayed as “not implemented”.
  If the inverter only has one DC input, all values for the second string are set
  to “not implemented” (from register 2_DCA). The description of the second input
  (register 2_IDStr) appears as “not supported” in this case. The values for the first
  (and only) input are displayed normally.
  Multiple MPPT
  Inverter Extensi-
  on Register
  Start address:
- for "float" setting: 40263
- for "int+SF" setting: 40253
  The Register tables can be found on the Fronius homepage or opened using the
  link:
  http://www.fronius.com/QR-link/0006
  Start Offset
  End Offset
  Size
  R/W
  Function codes
  Name
  Type
  Units
  Scale factor
  Description
  Range of values
  40 40 1 R 0x03 2_DCA uint16 A DCA_SF DC Current 1)
  41 41 1 R 0x03 2_DCV uint16 V DCV_SF DC Voltage 1)
  42 42 1 R 0x03 2_DCW uint16 W DCW_SF DC Power 1)

1. Total values
   DCW = Total DC power
   In hybrid systems:
   String 1 = PV input
   String 2 = Storage
   When discharging the storage: DCW = 1_DCW + 2_DCW
   When charging the storage: DCW = 1_DCW - 2_DCW
   Examples
   a) PV input: 2000 W production ==> 1_DCW = 2000 W
   Storage: 1000 W discharge ==> 2_DCW = 1000 W
   Englisch (US) 89
   DCW = 1_DCW + 2_DCW = 1000 W + 2000 W = 3000 W
   b) PV input: 2000 W production ==> 1_DCW = 2000 W
   Storage: - 1000 W charge ==> 2_DCW = 1000 W
   (only the absolute value can
   be shown in this register)
   DCW = 1_DCW + 2_DCW = 2000 W + (- 1000 W) = 1000 W
   90
   Basic Storage Control Model (124)
   General This model is only available for inverters with a storage solution.
   The Basic Storage Control Model can be used to make the following settings on
   the inverter:

- Setting a power window within which the charge/discharge capacity of the
  energy storage may fluctuate.
- Setting a minimum charge level that the energy storage must not fall below.
- Permitting/preventing grid charging of the energy storage.
  NOTE!
  All specifications are to be considered recommendations.
  The inverter may deviate from the specifications if this is necessary for opera-
  tional safety reasons.
  Information Pro-
  vided
  The Basic Storage Control Model provides the following read-only information:
  WChaMax
- If energy storage is available, this register feeds back the baseline value for
  the registers OutWRte and InWRt.
  WChaMax := max(MaxChaRte, MaxDisChaRte)
- If energy storage is not available, the register feeds back a value of 0.
  ChaState
- Energy storage charge level in %:
  Estimated_Capacity_Remaining [Wh] / Estimated_Capacity_Maximum [Wh]
  ChaSt
  Energy storage operating status
- OFF: Energy storage is not available
- EMPTY: Energy storage is currently fully discharged
- DISCHARGING: Energy storage is in the process of being discharged
- CHARGING: Energy storage is in the process of being charged
- FULL: Energy storage is currently fully charged
- HOLDING: Energy storage is currently neither charged nor discharged
- TESTING: used during calibration or service charge
  Power Window
  Specifications
  In the settings on the inverter's web interface, the setting "Inverter control via
  Modbus" must be enabled under Modbus for write functions to be possible. De-
  pending on the control priority that has been set (IO control, dynamic power re-
  duction, or control via Modbus), Modbus commands may not be accepted.
  The following examples assume that WchaMax = 3300 W.
  The following applies for the resulting power windows:
- Negative power values indicate that the energy storage is charging
- Positive values indicate that the energy storage is discharging
  Englisch (US) 91
  NOTE!
  The values in the following examples must be scaled according to their scale
  factors in the specified scale registers after reading and before writing.
  Manipulating the registers InWRte, OutWRte and StorCtl_Mod will generate
  changes in the battery status in Fronius Solar.web, ex: Forced Recharge and En-
  ergy saving mode, depending on user settings and current status of the battery.
  Example 1: Only permit energy storage charging
  This behavior can be achieved by limiting the maximum discharge capacity to 0%
  => results in window [-3300 W, 0 W]
- OutWRte = 0% (set discharge limit of WchaMax to 0%)
- StorCtl_Mod = 2 (activates discharge limit, bit pattern: 10)
- InWRte is not relevant in this case
  Example 2: Only permit energy storage discharging
  This behavior can be achieved by limiting the maximum charge capacity to 0% =>
  results in window [0 W, 3300 W]
- InWRte = 0% (set charge limit of WchaMax to 0%)
- StorCtl_Mod = 1 (bit 1 activates charge limit, bit pattern: 01)
- OutWRte is not relevant in this case
  Example 3: Do not permit charging or discharging
  This behavior can be achieved by limiting the maximum charge capacity to 0%
  and the maximum discharge capacity to 0%
  => results in window [0 W, 0 W]
- InWRte = 0% (set charge limit of WchaMax to 0%)
- OutWRte = 0% (set discharge limit of WchaMax to 0%)
- StorCtl_Mod = 3 (activate both limit values, bit pattern: 11)
  Example 4: Charging and discharging with maximum 50% of the nominal power
  This behavior can be achieved by limiting the maximum charge capacity to 50%
  and the maximum discharge capacity to 50%
  => results in window [-1650 W, 1650 W]
- InWRte = 50% (set charge limit of WchaMax to 50%)
- OutWRte = 50% (set discharge limit of WchaMax to 50%)
- StorCtl_Mod = 3 (activate both limit values, bit pattern: 11)
  Example 5: Charging in the range of 50% to 75% of the nominal power
  This behavior can be achieved by limiting the maximum charge capacity to 75%
  and the maximum discharge capacity to -50%
  => results in window [1650 W, 2475 W]
- InWRte = 75% (set charge limit of WchaMax to 75%)
- OutWRte = -50% (set discharge limit of WchaMax to -50%)
- StorCtl_Mod = 3 (activate both limit values, bit pattern: 11)
- Battery status in Fronius Solar.web will change to Forced Recharge
  Example 6: Discharging with 50% of the nominal power
  This behavior can be achieved by limiting the maximum charge capacity to -50%
  and the maximum discharge capacity to 50%
  => results in window [-1650 W, -1650 W]
- InWRte = -50% (set charge limit of WchaMax to -50%)
- OutWRte = 50% (set discharge limit of WchaMax to 50%)
- StorCtl_Mod = 3 (activate both limit values, bit pattern: 11)
  92
  Setting the Mini-
  mum Charge Le-
  vel
  Charging the en-
  ergy storage via
  the grid
  Basic Storage
  Controls Regis-
  ter
  Register manipu-
  lation and Batte-
  ry status chan-
  ges in Fronius
  Solar.web
  Example 7: Charging with 50% to 100% of the nominal power
  This behavior can be achieved by limiting the maximum discharge capacity to
  -50% => results in window [1650 W, 3300 W]
- OutWRte = -50% (set discharge limit of WchaMax to -50%)
- StorCtl_Mod = 2 (activates discharge limit, bit pattern: 10)
- InWRte is not relevant in this case
- Battery status in Fronius Solar.web will change to Forced Recharge
  By setting register MinRsvPct, a minimum state of charge of the energy storage
  can be set.
  For example, by setting MinRsvPct to 20%, a reserve of 20% of the state of char-
  ge can be reserved that the state of charge should not fall below.
  The ChaGriSet register can be used to allow or prevent inverter storage charging
  via the grid. The register ChaGriSet and the field "battery charging from DNO
  grid" in the Fronius system monitoring settings are AND-linked (Fronius system
  monitoring - Settings - DNO Editor - Battery charge). If the behavior is to be con-
  trolled by the ChaGriSet flag, "battery charging from DNO grid" must be che-
  cked.
  The battery can be woken from standby mode via the IC124 model. If the So-
  cMin under the last known SoC is set while the battery is in standby mode, this
  will be enabled.
  Start address:
- for "float" setting: 40313
- for "int+SF" setting: 40303
  The Register tables can be found on the Fronius homepage or opened using the
  link:
  http://www.fronius.com/QR-link/0006
  Fronius Solar.web allow users to visualize status changes from the battery. These
  changes can be seen in Fronius Solar.web under the option Energy balance then
  Production or Consumption. The changes are marked with a bubble status, cli-
  cking on a state change will show the previous state followed by an arrow and the
  new state.
  Englisch (US) 93
  Battery state change from Start-up to Normal Operation.
  Battery status changes are triggered during normal operation (when the battery
  is ready to enter in operation, security reasons,etc) or by manipulating the mod-
  bus registers MinRsvPct, InWRte, OutWRte and StorCtl_Mod.
  The changes could be triggered as follows:
- A minimum state of charge is set using the register MinRsvPct, the corre-
  sponding state change is “Energy-saving mode”.
- Setting the registers InWRte, OutWRte, StorCtl_Mod the battery status
  could change to “Forced Recharge”.
  94
  String Combiner Model (403)
  String Combiner
  Register
  The Register tables can be found on the Fronius homepage or opened using the
  link:
  http://www.fronius.com/QR-link/0006
  Englisch (US) 95
  Meter Model
  Meter Model Re-
  gister
  The data of an energy meter connected with the Fronius Datamanager via Mod-
  bus RTU can be read by the relevant SunSpec models via Modbus TCP.
  In a similar way to the inverter models, there are also two different SunSpec mo-
  dels in this case:
- the meter model with floating point display
  (setting "float"; 211, 212 or 213)
- the meter model with integers and scaling factors
  (setting "int+SF"; 201, 202 or 203)
  The register number of the two model types is different!
  The Modbus device ID of the energy meter is 240.
  The Register tables can be found on the Fronius homepage or opened using the
  link:
  http://www.fronius.com/QR-link/0006
  There are 4 different meter locations, which are described by the location num-
  ber (see table). Depending on where the Smart Meter is located and whether the
  inverter is producing or consuming, the signs of the PowerReal values and the
  Energy values change. These are shown in the following table:
  Meter_Loca-
  tion 0 (grid) 1 (load)
  3 (ext. gene-
  rator)
  256-511
  (subload)
  PowerRe-
  al_P_Sum (+
  positive)
  consuming
  from grid
  producing
  power
  generation load is produ-
  cing power
  PowerRe-
  al_P_Sum (-
  negative)
  feeding in to
  grid
  normal con-
  sumption
  consumption normal con-
  sumption
  energy plus
  (absolute
  counter)
  import from
  grid = energy
  consumed
  producing
  power* = en-
  ergy produ-
  ced
  generation =
  energy produ-
  ced
  producing
  power* = en-
  ergy produ-
  ced
  energy minus
  (absolute
  counter)
  export to grid
  = energy pro-
  duced
  consumption
  = energy con-
  sumed
  consumption
  = energy con-
  sumed
  consumption
  = energy con-
  sumed
  \*is not typically. May occur when other power generation is located in load path and producing more
  power than load can consume.
  96
  End Block
  General Two registers according to the last data model indicate that no further SunSpec
  models will follow.
  The addresses of these two registers are different depending on the device type
  (inverter, String Control, energy meter) and selected data type ("float" or "int
  +SF").
- Inverter:
- - Start address for setting "float": 40313
- - Start address for setting "int+SF": 40303
- Fronius String Control:
- - Start address: 40127
- Energy meter:
- - Start address for setting "float": 40195
- - Start address for setting "int+SF": 40176
    End Block The Register tables can be found on the Fronius homepage or opened using the
    link:
    http://www.fronius.com/QR-link/0006
    Englisch (US) 97
    String Combiner Event Flags
    String Combiner
    Event Flags
    Name Event Flags
    LOW_VOLTAGE 0x00000001
    LOW_POWER 0x00000002
    LOW_EFFICIENCY 0x00000004
    CURRENT 0x00000008
    VOLTAGE 0x00000010
    POWER 0x00000020
    PR 0x00000040
    DISCONNECTED 0x00000080
    FUSE_FAULT 0x00000100
    COMBINER_FUSE_FAULT 0x00000200
    COMBINER_CABINET_OPEN 0x00000400
    TEMP 0x00000800
    GROUNDFAULT 0x00001000
    REVERSED_POLARITY 0x00002000
    INCOMPATIBLE 0x00004000
    COMM_ERROR 0x00008000
    INTERNAL_ERROR 0x00010000
    THEFT 0x00020000
    ARC_DETECTED 0x00040000
    98
    Englisch (US) 99
-
-
