using System;
using System.Collections.Generic;
using MediNotes.Api.Models;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace MediNotes.Api.Migrations
{
    /// <inheritdoc />
    public partial class NoteBookNoteCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    Username = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Uuid);
                });

            migrationBuilder.CreateTable(
                name: "Notebooks",
                columns: table => new
                {
                    Uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    UserUuid = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notebooks", x => x.Uuid);
                    table.ForeignKey(
                        name: "FK_Notebooks_Users_UserUuid",
                        column: x => x.UserUuid,
                        principalTable: "Users",
                        principalColumn: "Uuid",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserImages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserUuid = table.Column<Guid>(type: "uuid", nullable: false),
                    ImagePath = table.Column<string>(type: "text", nullable: false),
                    ImageType = table.Column<string>(type: "text", nullable: false, defaultValue: "profile"),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserImages_Users_UserUuid",
                        column: x => x.UserUuid,
                        principalTable: "Users",
                        principalColumn: "Uuid",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UsersPasswordHashes",
                columns: table => new
                {
                    UserUuid = table.Column<Guid>(type: "uuid", nullable: false),
                    Hash = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UsersPasswordHashes", x => x.UserUuid);
                    table.ForeignKey(
                        name: "FK_UsersPasswordHashes_Users_UserUuid",
                        column: x => x.UserUuid,
                        principalTable: "Users",
                        principalColumn: "Uuid",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UsersPersonalData",
                columns: table => new
                {
                    UserUuid = table.Column<Guid>(type: "uuid", nullable: false),
                    FullName = table.Column<string>(type: "text", nullable: false),
                    Address = table.Column<string>(type: "text", nullable: true),
                    DateOfBirth = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UsersPersonalData", x => x.UserUuid);
                    table.ForeignKey(
                        name: "FK_UsersPersonalData_Users_UserUuid",
                        column: x => x.UserUuid,
                        principalTable: "Users",
                        principalColumn: "Uuid",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Notes",
                columns: table => new
                {
                    Uuid = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Content = table.Column<List<ContentBlock>>(type: "jsonb", nullable: false),
                    NoteBookUuid = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notes", x => x.Uuid);
                    table.ForeignKey(
                        name: "FK_Notes_Notebooks_NoteBookUuid",
                        column: x => x.NoteBookUuid,
                        principalTable: "Notebooks",
                        principalColumn: "Uuid",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Notebooks_UserUuid",
                table: "Notebooks",
                column: "UserUuid");

            migrationBuilder.CreateIndex(
                name: "IX_Notes_NoteBookUuid",
                table: "Notes",
                column: "NoteBookUuid");

            migrationBuilder.CreateIndex(
                name: "IX_UserImages_UserUuid",
                table: "UserImages",
                column: "UserUuid");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Notes");

            migrationBuilder.DropTable(
                name: "UserImages");

            migrationBuilder.DropTable(
                name: "UsersPasswordHashes");

            migrationBuilder.DropTable(
                name: "UsersPersonalData");

            migrationBuilder.DropTable(
                name: "Notebooks");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
